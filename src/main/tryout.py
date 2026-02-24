import gzip
import hashlib
import multiprocessing as mp
import operator
import itertools
import pickle
import os
from itertools import permutations

# --- Optimized Equation Class ---
class Equation:
    def __init__(self, repeat=2):
        self.repeat = repeat
        self.ops = [operator.add, operator.sub, operator.mul, operator.floordiv, operator.pow]

    def generate_permutations(self):
        return list(itertools.product(self.ops, repeat=self.repeat))

# --- WORKER: Parallel Math Core ---
def worker(order, max_constant, token_count, operations, queue, seen_hashes):
    from stateshaper import RunEngine 
    engine = RunEngine()
    engine.start_engine()
    
    eq_provider = Equation(repeat=operations)
    all_equations = eq_provider.generate_permutations() 

    constants = {"a": 1, "b": 1, "c": 1, "d": 1}
    batch = []
    local_seen = set() 

    for custom_equation in all_equations:
        for key in order:
            constants[key] = 1 
            while constants[key] < max_constant:
                try:
                    engine.define_engine(constants=constants)
                    engine.set_equation(custom_equation)
                    current_map = engine.run_engine(token_count=token_count)
                    
                    map_str = ",".join(map(str, current_map))
                    map_hash = hashlib.md5(map_str.encode('utf-8')).digest()
                    
                    if map_hash not in local_seen:
                        if map_hash not in seen_hashes:
                            seen_hashes[map_hash] = True
                            local_seen.add(map_hash)
                            
                            val = f"({constants['a']},{constants['b']},{constants['c']},{constants['d']},'{map_str}')"
                            batch.append(val)
                            
                            if len(batch) >= 1500:
                                queue.put("INSERT INTO token_maps VALUES " + ",".join(batch) + ";\n")
                                batch = []
                except (ZeroDivisionError, OverflowError, ValueError):
                    pass 
                constants[key] += 1
    
    if batch:
        queue.put("INSERT INTO token_maps VALUES " + ",".join(batch) + ";\n")

# --- WRITER: Disk I/O (One file per operation depth) ---
def file_writer(queue, output_file):
    # Use 'wt' (Write Text) to ensure a fresh file for each iteration
    with gzip.open(output_file, "wt", encoding="utf-8", compresslevel=4) as f:
        f.write("PRAGMA synchronous = OFF;\nBEGIN TRANSACTION;\n")
        f.write("CREATE TABLE IF NOT EXISTS token_maps (const_a INT, const_b INT, const_c INT, const_d INT, map_data TEXT);\n")
        while True:
            data = queue.get()
            if data == "DONE": break
            f.write(data)
        f.write("COMMIT;\n")

# --- MAIN CONTROLLER ---
if __name__ == "__main__":
    # --- CONFIG ---
    MAX_C = 999999    
    TOKENS = 128      
    BASE_PATH = "C:/Users/jdunn/Documents/"
    CHECKPOINT_FILE = os.path.join(BASE_PATH, "hashes_checkpoint.pkl")
    OP_SEQUENCE = [2, 3, 4]

    manager = mp.Manager()
    
    # --- LOAD CHECKPOINT (Maintains uniqueness across restarts) ---
    if os.path.exists(CHECKPOINT_FILE):
        print(f"Loading checkpoint: {CHECKPOINT_FILE}")
        with open(CHECKPOINT_FILE, "rb") as f:
            seen_hashes = manager.dict(pickle.load(f))
        print(f"Resuming with {len(seen_hashes)} unique maps.")
    else:
        seen_hashes = manager.dict() 
    
    print(f"Starting build on {mp.cpu_count()} cores.")
    
    try:
        for op_depth in OP_SEQUENCE:
            # Create a unique filename for this iteration
            iter_file = os.path.join(BASE_PATH, f"data_ops_{op_depth}.sql.gz")
            print(f"\n>>> NOW GENERATING: {iter_file}")
            
            queue = manager.Queue(maxsize=1000)
            
            # Start a fresh writer for this iteration's file
            writer_proc = mp.Process(target=file_writer, args=(queue, iter_file))
            writer_proc.start()
            
            with mp.Pool(processes=mp.cpu_count()) as pool:
                orders = list(permutations(["a", "b", "c", "d"]))
                jobs = [pool.apply_async(worker, (o, MAX_C, TOKENS, op_depth, queue, seen_hashes)) for o in orders]
                
                for i, job in enumerate(jobs):
                    job.get() 
                    print(f"  [Op {op_depth}] Permutation {i+1}/24 done. Global Uniques: {len(seen_hashes)}")
                    
                    # Periodic Checkpoint Save
                    with open(CHECKPOINT_FILE, "wb") as f:
                        pickle.dump(dict(seen_hashes), f)
            
            # Close the current file writer before moving to the next iteration
            queue.put("DONE")
            writer_proc.join()
                
    finally:
        print(f"BUILD COMPLETE. Check {BASE_PATH} for .sql.gz files.")
