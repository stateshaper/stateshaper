import hashlib, sqlite3, cbor2, itertools, os, time, sys
import multiprocessing as mp
import numpy as np
from numba import njit, uint64

# --- CONFIGURATION ---
MOD = 2147483647  # 31-bit Mersenne Prime
Z85_CHARS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.-:+=^!/*?&<>()[]{}@%$#"

# --- JIT ACCELERATED CORE ---
@njit(fastmath=True, cache=True)
def run_mega_search(a, b, c, d, op_indices, target_lo, target_hi):
    """Machine-code compiled LCG search."""
    custom_val = 0
    for i in range(len(op_indices)):
        op_type = op_indices[i]
        v1, v2 = (a, c) if i % 3 == 0 else (d, b) if i % 5 == 0 else (c, a)
        
        if op_type == 0: val = v1 + v2
        elif op_type == 1: val = v1 - v2
        elif op_type == 2: val = v1 * v2
        elif op_type == 3: val = v1 // v2 if v2 != 0 else 0
        elif op_type == 4: val = (v1 ** (v2 % 7)) % MOD 
        elif op_type == 5: val = v1 ^ v2
        elif op_type == 6: val = v1 & v2
        elif op_type == 7: val = v1 % v2 if v2 != 0 else 0
        custom_val += val

    state, gen_lo, gen_hi = uint64(1), uint64(0), uint64(0)
    for i in range(64):
        state = (uint64(custom_val) * state + uint64(d)) % uint64(MOD)
        if state % 2: gen_lo |= (uint64(1) << i)
    for i in range(64):
        state = (uint64(custom_val) * state + uint64(d)) % uint64(MOD)
        if state % 2: gen_hi |= (uint64(1) << i)

    diff_lo, diff_hi, dist = gen_lo ^ target_lo, gen_hi ^ target_hi, 0
    for v in (diff_lo, diff_hi):
        while v > 0:
            v &= v - uint64(1)
            dist += 1
    return dist, gen_lo, gen_hi

# --- WORKER: Chaotic Sampling ---
def chaotic_worker(worker_id, iterations, op_depth, t_lo, t_hi, queue):
    """Uses a local LCG to jump around the 1-999,999 space randomly."""
    # Secondary LCG for 'jumping'
    # Each worker starts at a different point based on worker_id
    state = uint64(worker_id + int(time.time()))
    MAX_V = 999999
    
    # Pre-generate operator combinations
    all_eqs = np.array(list(itertools.product(range(8), repeat=op_depth)), dtype=np.int32)
    best_dist = 128

    for _ in range(iterations):
        # Generate 4 'chaotic' constants
        state = (uint64(1664525) * state + uint64(1013904223)) % uint64(2**32)
        a = int(state % MAX_V) + 1
        state = (uint64(1664525) * state + uint64(1013904223)) % uint64(2**32)
        b = int(state % MAX_V) + 1
        state = (uint64(1664525) * state + uint64(1013904223)) % uint64(2**32)
        c = int(state % MAX_V) + 1
        state = (uint64(1664525) * state + uint64(1013904223)) % uint64(2**32)
        d = int(state % MAX_V) + 1

        for eq in all_eqs:
            dist, glo, ghi = run_mega_search(a, b, c, d, eq, t_lo, t_hi)
            if dist < best_dist:
                best_dist = dist
                queue.put({'c': [a,b,c,d], 'e': eq.tolist(), 'x': (int(ghi) << 64) | int(glo), 'score': dist})

# --- RECOVERY & REGISTRY ---
def to_base85(n):
    res = []
    for _ in range(6):
        res.append(Z85_CHARS[n % 85])
        n //= 85
    return "".join(reversed(res))

def db_manager(queue, db_path, target_int):
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    cur.execute("CREATE TABLE IF NOT EXISTS registry (id_key TEXT PRIMARY KEY, data BLOB, score INT)")
    
    global_best = 128
    key_idx = 0
    try:
        while True:
            res = queue.get()
            if res == "DONE": break
            if res['score'] < global_best:
                global_best = res['score']
                # Lossless XOR Patch stored in CBOR
                payload = cbor2.dumps({'c': res['c'], 'e': res['e'], 'x': target_int ^ res['x']})
                key = to_base85(key_idx)
                cur.execute("INSERT OR REPLACE INTO registry VALUES (?, ?, ?)", (key, payload, res['score']))
                conn.commit()
                key_idx += 1
                print(f"[*] NEW BEST! Key: {key} | Score: {res['score']} | C: {res['c']}")
    except KeyboardInterrupt: pass

# --- MAIN ---
if __name__ == "__main__":
    TARGET = input("Enter 128-bit Target: ").strip()
    target_int = int(TARGET, 2)
    t_lo, t_hi = uint64(target_int & 0xFFFFFFFFFFFFFFFF), uint64(target_int >> 64)
    
    DB_PATH = "results.db"
    queue = mp.Manager().Queue()
    writer = mp.Process(target=db_manager, args=(queue, DB_PATH, target_int))
    writer.start()

    print(f"Starting Chaotic Search. Press Ctrl+C to stop at any time.")
    
    try:
        with mp.Pool(mp.cpu_count()) as pool:
            # We scale through operation depths (2, 3, then 4)
            for op_depth in [2, 3, 4]:
                # Each core runs 1,000,000 chaotic samples per batch
                for i in range(mp.cpu_count()):
                    pool.apply_async(chaotic_worker, (i, 1000000, op_depth, t_lo, t_hi, queue))
                
                print(f"  [Depth {op_depth}] Dispatched batches to {mp.cpu_count()} cores.")
                
            pool.close()
            pool.join()
    except KeyboardInterrupt:
        print("\nStopping... Finalizing database.")
    finally:
        queue.put("DONE")
        writer.join()
        print(f"Search complete. Best results are in {DB_PATH}")
