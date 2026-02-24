# token_map = []
# map_values = []

# from asyncio import run
# from itertools import permutations


# def build_map(engine, max_constant=9999, token_count=100):
#     base_order = ["a", "b", "c", "d"]

#     for order in permutations(base_order):
#         constants = {"a": 1, "b": 1, "c": 1, "d": 1}

#         for key in order:
#             while constants[key] < max_constant:
#                 engine.define_engine(constants=constants)
#                 current_map = engine.run_engine(token_count=token_count)
#                 if current_map not in map_values:
#                     token_map.append([constants, current_map])
#                     map_values.append(current_map)
#                 constants[key] += 1
#                 # print()
#                 # print(token_map)
#                 # print()
#                 # print(constants)

#     return token_map

import gzip
import multiprocessing as mp
from itertools import permutations

# --- WORKER ---
def worker(order, max_constant, token_count, queue):
    # 1. Initialize the engine INSIDE the worker for Windows compatibility
    # Replace 'RunEngine()' with your actual class name and imports
    from stateshaper import RunEngine 
    engine = RunEngine() 

    constants = {"a": 1, "b": 1, "c": 1, "d": 1}
    batch = []
    
    for key in order:
        # Reset current key to 1 for this specific permutation path
        constants[key] = 1 
        
        while constants[key] < max_constant:
            # 2. Match your existing class structure:
            # First define the constants, then run
            engine.define_engine(constants=constants)
            current_map = engine.run_engine(token_count=token_count)
            
            # Format and buffer
            map_str = ",".join(map(str, current_map))
            val = f"({constants['a']},{constants['b']},{constants['c']},{constants['d']},'{map_str}')"
            batch.append(val)
            
            constants[key] += 1
            
            # 3. Batching for performance
            if len(batch) >= 2000:
                queue.put("INSERT INTO token_maps VALUES " + ",".join(batch) + ";\n")
                batch = []
    
    if batch:
        queue.put("INSERT INTO token_maps VALUES " + ",".join(batch) + ";\n")

# --- LISTENER ---
def file_writer(queue, output_file):
    # Adding .gz extension and using gzip.open
    if not output_file.endswith(".gz"):
        output_file += ".gz"
        
    # 'wt' means Write Text mode
    with gzip.open(output_file, "wt", encoding="utf-8", compresslevel=6) as f:
        f.write("BEGIN TRANSACTION;\n")
        f.write("CREATE TABLE IF NOT EXISTS token_maps (const_a INT, const_b INT, const_c INT, const_d INT, map_data TEXT);\n")
        while True:
            try:
                data = queue.get()
                if data == "DONE": break
                f.write(data)
            except EOFError:
                break
        f.write("COMMIT;\n")

# --- MAIN BLOCK ---
if __name__ == "__main__":
    # Settings
    MAX_C = 999999
    TOKENS = 100
    FILE_NAME = "C:/Users/jdunn/Documents/data.sql"
    
    # Use a manager for the communication queue
    manager = mp.Manager()
    queue = manager.Queue(maxsize=200) 
    
    # 1. Start the Writer Process
    writer_proc = mp.Process(target=file_writer, args=(queue, FILE_NAME))
    writer_proc.start()
    
    # 2. Start Workers using a Pool
    # We use the number of CPU cores available
    cpu_count = mp.cpu_count()
    print(f"Starting build with {cpu_count} cores...")
    
    try:
        with mp.Pool(processes=cpu_count) as pool:
            orders = list(permutations(["a", "b", "c", "d"]))
            
            # map_async distributes the work
            results = [pool.apply_async(worker, (o, MAX_C, TOKENS, queue)) for o in orders]
            
            # Wait for all workers to finish
            for r in results:
                r.get() 
                
    finally:
        # 3. Clean up
        queue.put("DONE")
        writer_proc.join()
        print("Work complete.")
