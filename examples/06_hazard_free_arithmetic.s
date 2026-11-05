# ==================================================================
# CS3520 LIMO Milestone M3 - Hazard-Free Arithmetic Benchmark
# Team: Visionary Architects (National University of Lesotho)
# ==================================================================
# Verifies R-format (kop, ts, le, kp, ng) and I-format (khh)
# running on the 5-stage pipeline without RAW data hazards.
# Independent instructions / NOPs provide required inter-stage isolation.
# ==================================================================

# 1. Initialize input registers
khh r6, r0, 36       # r6 = 36 (Thuso0 / a0)
khh r7, r0, 14       # r7 = 14 (Thuso1 / a1)
khh r16, r0, 100     # independent register setup
khh r17, r0, 200     # independent register setup

# 2. Arithmetic Addition (Kopanya): r6 + r7 -> r8 (50)
kop r8, r6, r7       # r8 = 36 + 14 = 50 (Nakoana0 / t0)
khh r18, r0, 300     # independent instruction
khh r19, r0, 400     # independent instruction

# 3. Arithmetic Subtraction (Tlosa): r8 - r7 -> r9 (36)
ts  r9, r8, r7       # r9 = 50 - 14 = 36 (Nakoana1 / t1)
khh r20, r0, 500     # independent instruction
khh r21, r0, 600     # independent instruction

# 4. Bitwise Logic AND (Le) & OR (Kapa)
le  r10, r6, r7      # r10 = 36 & 14 = 4
kp  r11, r6, r7      # r11 = 36 | 14 = 46
khh r22, r0, 700     # independent instruction
khh r23, r0, 800     # independent instruction

# 5. Shift Left Logical (Ngatafala)
khh r12, r0, 2       # shift amount
khh r1, r0, 0        # NOP bubble
khh r1, r0, 0        # NOP bubble
ng  r13, r10, r12    # r13 = 4 << 2 = 16
