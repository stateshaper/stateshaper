import gzip
import hashlib
import math
import multiprocessing as mp
from itertools import permutations
import sys
from equations import Equation
from stateshaper import RunEngine  # Import your specific class



# --- WORKER: Math + Hashing ---
def worker(order, max_constant, token_count, operations, queue, seen_hashes):
    equation = Equation(repeat=operations)
    engine = RunEngine() 
    engine.start_engine()
    custom_equation = next(equation.generate_permutations(iteration=1))
    # print(f"Constants values {order}, using equation: {engine.engine.custom_morph}")
    # engine.run_engine(token_count=token_count)
    # sys.exit()

    constants = {"a": 1, "b": 1, "c": 1, "d": 1}
    batch = []
    
    for key in order:
        constants[key] = 1 
        while constants[key] < max_constant:
            engine.define_engine(constants=constants)
            engine.set_equation(custom_equation)
            current_map = engine.run_engine(token_count=token_count)
            #print(f"\n\n\n\nGenerated map: \n\nMap {current_map} \n\nEquation: {engine.engine.custom_morph} \n\nConstants: {constants}")
            # 1. THE HASH TRICK: Convert map to a unique 16-byte binary fingerpint
            map_str = ",".join(map(str, current_map))
            # .digest() returns bytes (16 bytes for MD5), much smaller than hex strings
            map_hash = hashlib.md5(map_str.encode('utf-8')).digest()
            
            # 2. FAST UNIQUE CHECK: Only store if hash hasn't been seen
            if map_hash not in seen_hashes:
                seen_hashes[map_hash] = True 
                
                val = f"({constants['a']},{constants['b']},{constants['c']},{constants['d']},'{map_str}')"
                batch.append(val)
                
                if len(batch) >= 2000:
                    queue.put("INSERT INTO token_maps VALUES " + ",".join(batch) + ";\n")
                    batch = []
            
            constants[key] += 1
    
    if batch:
        queue.put("INSERT INTO token_maps VALUES " + ",".join(batch) + ";\n")

# --- WRITER: Compressed File Saving ---
def file_writer(queue, output_file):
    # compresslevel=4 is 2-3x faster than the Python default of 9
    with gzip.open(output_file, "wt", encoding="utf-8", compresslevel=4) as f:
        f.write("BEGIN TRANSACTION;\n")
        f.write("CREATE TABLE IF NOT EXISTS token_maps (const_a INT, const_b INT, const_c INT, const_d INT, map_data TEXT);\n")
        while True:
            data = queue.get()
            if data == "DONE": break
            f.write(data)
        f.write("COMMIT;\n")

if __name__ == "__main__":
    # CONFIG
    MAX_C = 999999
    TOKENS = 128 
    FILE_NAME = "C:/Users/jdunn/Documents/data.sql.gz" 
    ITERATIONS = 4
    OPERATIONS = 2
    
    manager = mp.Manager()
    queue = manager.Queue(maxsize=500)
    # The shared set now only stores 16-byte hashes instead of 500-byte strings
    seen_hashes = manager.dict() 
    
    writer_proc = mp.Process(target=file_writer, args=(queue, FILE_NAME))
    writer_proc.start()
    
    print(f"Starting build on {mp.cpu_count()} cores using MD5 Hash Trick...")
    
    with mp.Pool(processes=mp.cpu_count()) as pool:
        for _ in range(math.factorial(ITERATIONS)):  
            orders = list(permutations(["a", "b", "c", "d"]))
            jobs = [pool.apply_async(worker, (o, MAX_C, TOKENS, OPERATIONS, queue, seen_hashes)) for o in orders]
            for job in jobs:
                job.get() 
            print(f"Completed iteration with {OPERATIONS} operations. Unique maps so far: {len(seen_hashes)}")
            OPERATIONS += 1
                
    queue.put("DONE")
    writer_proc.join()
    print(f"Finished! Found {len(seen_hashes)} unique maps.")
