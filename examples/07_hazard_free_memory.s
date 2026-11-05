# ==================================================================
# CS3520 LIMO Milestone M3 - Hazard-Free Memory Benchmark
# Team: Visionary Architects (National University of Lesotho)
# ==================================================================
# Demonstrates Store Word (blk) and Load Word (lt) on the 5-stage pipeline.
# Writing in MEM stage and reading back without load-use hazards.
# ==================================================================

# 1. Setup base pointer and data values
khh r2, r0, 1000     # r2 = base memory address (1000)
khh r6, r0, 42       # r6 = first value (42)
khh r7, r0, 99       # r7 = second value (99)
khh r1, r0, 0        # independent NOP

# 2. Store values to Data Memory
blk r6, 4(r2)        # Mem[1004] = 42
blk r7, 8(r2)        # Mem[1008] = 99
khh r16, r0, 1       # independent scratchpad calculation
khh r17, r0, 2       # independent scratchpad calculation

# 3. Load values back from Data Memory
lt  r8, 4(r2)        # r8 = Mem[1004] = 42
lt  r9, 8(r2)        # r9 = Mem[1008] = 99
khh r1, r0, 0        # NOP
khh r1, r0, 0        # NOP

# 4. Verify sum of loaded words
kop r10, r8, r9      # r10 = 42 + 99 = 141
