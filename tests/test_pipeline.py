#!/usr/bin/env python3
"""
============================================================================
LIMO Studio - 5-Stage Pipeline Core Unit Test Runner (Python verification for M3)
National University of Lesotho · Department of Computer Science
CS3520 Computer Organisation and Architecture
Team: Visionary Architects
============================================================================
"""

import sys

# 1. CONTROL SIGNALS TRUTH TABLE
def control_unit_decode(mnemonic):
    m = mnemonic.lower().strip()
    if m in ('kop', 'add'):
        return {'reg_write': True, 'alu_src': False, 'alu_op': 'ADD', 'mem_read': False, 'mem_write': False, 'branch': False, 'branch_cond': None, 'mem_to_reg': False}
    elif m in ('ts', 'sub'):
        return {'reg_write': True, 'alu_src': False, 'alu_op': 'SUB', 'mem_read': False, 'mem_write': False, 'branch': False, 'branch_cond': None, 'mem_to_reg': False}
    elif m in ('khh', 'addi'):
        return {'reg_write': True, 'alu_src': True, 'alu_op': 'ADD', 'mem_read': False, 'mem_write': False, 'branch': False, 'branch_cond': None, 'mem_to_reg': False}
    elif m in ('le', 'and'):
        return {'reg_write': True, 'alu_src': False, 'alu_op': 'AND', 'mem_read': False, 'mem_write': False, 'branch': False, 'branch_cond': None, 'mem_to_reg': False}
    elif m in ('kp', 'or'):
        return {'reg_write': True, 'alu_src': False, 'alu_op': 'OR', 'mem_read': False, 'mem_write': False, 'branch': False, 'branch_cond': None, 'mem_to_reg': False}
    elif m in ('ng', 'sll', 'slli'):
        return {'reg_write': True, 'alu_src': False, 'alu_op': 'SLL', 'mem_read': False, 'mem_write': False, 'branch': False, 'branch_cond': None, 'mem_to_reg': False}
    elif m in ('lt', 'lw'):
        return {'reg_write': True, 'alu_src': True, 'alu_op': 'ADD', 'mem_read': True, 'mem_write': False, 'branch': False, 'branch_cond': None, 'mem_to_reg': True}
    elif m in ('blk', 'sw'):
        return {'reg_write': False, 'alu_src': True, 'alu_op': 'ADD', 'mem_read': False, 'mem_write': True, 'branch': False, 'branch_cond': None, 'mem_to_reg': False}
    elif m in ('hlk', 'beq'):
        return {'reg_write': False, 'alu_src': False, 'alu_op': 'SUB', 'mem_read': False, 'mem_write': False, 'branch': True, 'branch_cond': 'EQ', 'mem_to_reg': False}
    elif m in ('hft', 'bgt'):
        return {'reg_write': False, 'alu_src': False, 'alu_op': 'SUB', 'mem_read': False, 'mem_write': False, 'branch': True, 'branch_cond': 'GT', 'mem_to_reg': False}
    return {'reg_write': False, 'alu_src': False, 'alu_op': 'ADD', 'mem_read': False, 'mem_write': False, 'branch': False, 'branch_cond': None, 'mem_to_reg': False}

LIMO_REGISTERS = {
    'r0': 0, 'letho': 0, 'zero': 0, 'x0': 0,
    'r1': 1, 'khutlisa': 1, 'ra': 1, 'x1': 1,
    'r2': 2, 'tshupo': 2, 'sp': 2, 'x2': 2,
    'r3': 3, 'sebali': 3, 'pc': 3, 'x3': 3,
    'r4': 4, 'sesupi': 4, 'gp': 4, 'x4': 4,
    'r5': 5, 'lesupa': 5, 'fp': 5, 'x5': 5,
    'r6': 6, 'thuso0': 6, 'a0': 6, 'x6': 6,
    'r7': 7, 'thuso1': 7, 'a1': 7, 'x7': 7,
    'r8': 8, 'nakoana0': 8, 't0': 8, 'x8': 8,
    'r9': 9, 'nakoana1': 9, 't1': 9, 'x9': 9,
    'r10': 10, 'nakoana2': 10, 't2': 10, 'x10': 10,
    'r11': 11, 'nakoana3': 11, 't3': 11, 'x11': 11,
    'r12': 12, 'nakoana4': 12, 't4': 12, 'x12': 12,
    'r13': 13, 'nakoana5': 13, 't5': 13, 'x13': 13,
    'r14': 14, 'nakoana6': 14, 't6': 14, 'x14': 14,
    'r15': 15, 'nakoana7': 15, 't7': 15, 'x15': 15,
    'r16': 16, 'polokelo0': 16, 's0': 16, 'x16': 16,
    'r17': 17, 'polokelo1': 17, 's1': 17, 'x17': 17,
    'r18': 18, 'polokelo2': 18, 's2': 18, 'x18': 18,
    'r19': 19, 'polokelo3': 19, 's3': 19, 'x19': 19,
    'r20': 20, 'polokelo4': 20, 's4': 20, 'x20': 20,
    'r21': 21, 'polokelo5': 21, 's5': 21, 'x21': 21,
    'r22': 22, 'polokelo6': 22, 's6': 22, 'x22': 22,
    'r23': 23, 'polokelo7': 23, 's7': 23, 'x23': 23,
    'r24': 24, 'polokelo8': 24, 's8': 24, 'x24': 24,
    'r25': 25, 'polokelo9': 25, 's9': 25, 'x25': 25,
    'r26': 26, 'polokelo10': 26, 's10': 26, 'x26': 26,
    'r27': 27, 'polokelo11': 27, 's11': 27, 'x27': 27,
    'r28': 28, 'tsehlahlamang0': 28, 't8': 28, 'x28': 28,
    'r29': 29, 'tsehlahlamang1': 29, 't9': 29, 'x29': 29,
    'r30': 30, 'tsehlahlamang2': 30, 't10': 30, 'x30': 30,
    'r31': 31, 'tsehlahlamang3': 31, 't11': 31, 'x31': 31,
}

def parse_reg(token):
    if not token:
        return None
    clean = token.strip().lower().rstrip(',')
    return LIMO_REGISTERS.get(clean, None)

class LimoPipelineCore:
    def __init__(self):
        self.reset()

    def reset(self):
        self.registers = [0] * 32
        self.registers[2] = 0x7FFFFFF0  # SP
        self.memory = {}
        self.pc = 0x00400000
        self.cycle = 0
        self.instructions_retired = 0
        self.flushed = False

        self.IF_ID = {'valid': False, 'pc': 0x00400000, 'mnemonic': 'nop', 'tokens': ['nop'], 'raw': 'nop'}
        self.ID_EX = {'valid': False, 'pc': 0x00400000, 'rs1': 0, 'rs2': 0, 'rd': 0, 'rs1_val': 0, 'rs2_val': 0, 'imm': 0, 'mnemonic': 'nop', 'raw': 'nop', 'reg_write': False, 'mem_read': False, 'mem_write': False, 'branch': False, 'branch_cond': None, 'alu_src': False, 'alu_op': 'ADD', 'mem_to_reg': False}
        self.EX_MEM = {'valid': False, 'pc': 0x00400000, 'alu_result': 0, 'store_data': 0, 'branch_target': 0, 'branch_taken': False, 'rd': 0, 'mnemonic': 'nop', 'raw': 'nop', 'reg_write': False, 'mem_read': False, 'mem_write': False, 'mem_to_reg': False}
        self.MEM_WB = {'valid': False, 'pc': 0x00400000, 'mem_read_data': 0, 'alu_result': 0, 'write_back_data': 0, 'rd': 0, 'mnemonic': 'nop', 'raw': 'nop', 'reg_write': False, 'mem_to_reg': False}

        self.program = []
        self.label_map = {}

    def load_program(self, source_code):
        self.reset()
        lines = source_code.strip().split('\n')
        self.program = []
        self.label_map = {}

        for line in lines:
            no_comment = line.split('#')[0].split(';')[0].strip()
            if not no_comment or no_comment.startswith('.'):
                continue
            working = no_comment
            if ':' in working:
                parts = working.split(':', 1)
                label = parts[0].strip().lower()
                self.label_map[label] = len(self.program)
                working = parts[1].strip()
            if not working:
                continue
            tokens = [t.strip() for t in working.replace(',', ' ').replace('(', ' ').replace(')', ' ').split() if t.strip()]
            if tokens:
                self.program.append({
                    'raw': line.strip(),
                    'mnemonic': tokens[0].lower(),
                    'tokens': tokens,
                    'pc': 0x00400000 + len(self.program) * 4
                })

    def step(self):
        self.cycle += 1
        self.flushed = False

        # 5. WB
        if self.MEM_WB['valid']:
            if self.MEM_WB['reg_write'] and self.MEM_WB['rd'] != 0:
                self.registers[self.MEM_WB['rd']] = self.MEM_WB['write_back_data']
            self.registers[0] = 0
            self.instructions_retired += 1

        # 4. MEM
        next_MEM_WB = {'valid': False, 'pc': 0x00400000, 'mem_read_data': 0, 'alu_result': 0, 'write_back_data': 0, 'rd': 0, 'mnemonic': 'nop', 'raw': 'nop', 'reg_write': False, 'mem_to_reg': False}
        if self.EX_MEM['valid']:
            mem_read_data = 0
            if self.EX_MEM['mem_read']:
                mem_read_data = self.memory.get(self.EX_MEM['alu_result'], 0)
            if self.EX_MEM['mem_write']:
                self.memory[self.EX_MEM['alu_result']] = self.EX_MEM['store_data']
            wb_data = mem_read_data if self.EX_MEM['mem_to_reg'] else self.EX_MEM['alu_result']
            next_MEM_WB = {
                'valid': True,
                'pc': self.EX_MEM['pc'],
                'mem_read_data': mem_read_data,
                'alu_result': self.EX_MEM['alu_result'],
                'write_back_data': wb_data,
                'rd': self.EX_MEM['rd'],
                'mnemonic': self.EX_MEM['mnemonic'],
                'raw': self.EX_MEM['raw'],
                'reg_write': self.EX_MEM['reg_write'],
                'mem_to_reg': self.EX_MEM['mem_to_reg']
            }

        # 3. EX
        next_EX_MEM = {'valid': False, 'pc': 0x00400000, 'alu_result': 0, 'store_data': 0, 'branch_target': 0, 'branch_taken': False, 'rd': 0, 'mnemonic': 'nop', 'raw': 'nop', 'reg_write': False, 'mem_read': False, 'mem_write': False, 'mem_to_reg': False}
        branch_taken = False
        branch_target = 0

        if self.ID_EX['valid']:
            opA = self.ID_EX['rs1_val']
            opB = self.ID_EX['imm'] if self.ID_EX['alu_src'] else self.ID_EX['rs2_val']
            alu_result = 0
            op = self.ID_EX['alu_op']
            if op == 'ADD':
                alu_result = (opA + opB) & 0xFFFFFFFF
                if alu_result >= 0x80000000:
                    alu_result -= 0x100000000
            elif op == 'SUB':
                alu_result = (opA - opB) & 0xFFFFFFFF
                if alu_result >= 0x80000000:
                    alu_result -= 0x100000000
            elif op == 'AND':
                alu_result = opA & opB
            elif op == 'OR':
                alu_result = opA | opB
            elif op == 'SLL':
                alu_result = (opA << (opB & 0x1F)) & 0xFFFFFFFF
                if alu_result >= 0x80000000:
                    alu_result -= 0x100000000

            if self.ID_EX['branch']:
                if self.ID_EX['branch_cond'] == 'EQ':
                    branch_taken = (self.ID_EX['rs1_val'] == self.ID_EX['rs2_val'])
                elif self.ID_EX['branch_cond'] == 'GT':
                    branch_taken = (self.ID_EX['rs1_val'] > self.ID_EX['rs2_val'])
                branch_target = self.ID_EX['pc'] + self.ID_EX['imm']

            next_EX_MEM = {
                'valid': True,
                'pc': self.ID_EX['pc'],
                'alu_result': alu_result,
                'store_data': self.ID_EX['rs2_val'],
                'branch_target': branch_target,
                'branch_taken': branch_taken,
                'rd': self.ID_EX['rd'],
                'mnemonic': self.ID_EX['mnemonic'],
                'raw': self.ID_EX['raw'],
                'reg_write': self.ID_EX['reg_write'],
                'mem_read': self.ID_EX['mem_read'],
                'mem_write': self.ID_EX['mem_write'],
                'mem_to_reg': self.ID_EX['mem_to_reg']
            }

        # 2. ID
        next_ID_EX = {'valid': False, 'pc': 0x00400000, 'rs1': 0, 'rs2': 0, 'rd': 0, 'rs1_val': 0, 'rs2_val': 0, 'imm': 0, 'mnemonic': 'nop', 'raw': 'nop', 'reg_write': False, 'mem_read': False, 'mem_write': False, 'branch': False, 'branch_cond': None, 'alu_src': False, 'alu_op': 'ADD', 'mem_to_reg': False}
        if self.IF_ID['valid']:
            tokens = self.IF_ID['tokens']
            mnemonic = self.IF_ID['mnemonic']
            ctrl = control_unit_decode(mnemonic)
            rd = 0
            rs1 = 0
            rs2 = 0
            imm = 0

            if mnemonic in ('kop', 'ts', 'le', 'kp', 'ng', 'add', 'sub', 'and', 'or', 'sll'):
                rd = parse_reg(tokens[1]) or 0
                rs1 = parse_reg(tokens[2]) or 0
                rs2 = parse_reg(tokens[3]) or 0
            elif mnemonic in ('khh', 'addi'):
                rd = parse_reg(tokens[1]) or 0
                rs1 = parse_reg(tokens[2]) or 0
                imm = int(tokens[3])
            elif mnemonic in ('lt', 'lw'):
                rd = parse_reg(tokens[1]) or 0
                imm = int(tokens[2])
                rs1 = parse_reg(tokens[3]) or 0
            elif mnemonic in ('blk', 'sw'):
                rs2 = parse_reg(tokens[1]) or 0
                imm = int(tokens[2])
                rs1 = parse_reg(tokens[3]) or 0
            elif mnemonic in ('hlk', 'hft', 'beq', 'bgt'):
                rs1 = parse_reg(tokens[1]) or 0
                rs2 = parse_reg(tokens[2]) or 0
                target = tokens[3].lstrip('+').lower()
                if target in self.label_map:
                    target_addr = 0x00400000 + self.label_map[target] * 4
                    imm = target_addr - self.IF_ID['pc']
                else:
                    imm = int(target)

            rs1_val = 0 if rs1 == 0 else self.registers[rs1]
            rs2_val = 0 if rs2 == 0 else self.registers[rs2]

            next_ID_EX = {
                'valid': True,
                'pc': self.IF_ID['pc'],
                'rs1': rs1,
                'rs2': rs2,
                'rd': rd,
                'rs1_val': rs1_val,
                'rs2_val': rs2_val,
                'imm': imm,
                'mnemonic': mnemonic,
                'raw': self.IF_ID['raw'],
                **ctrl
            }

        # 1. IF
        next_IF_ID = {'valid': False, 'pc': 0x00400000, 'mnemonic': 'nop', 'tokens': ['nop'], 'raw': 'nop'}
        if branch_taken:
            self.pc = branch_target
            next_IF_ID = {'valid': False, 'pc': 0x00400000, 'mnemonic': 'nop', 'tokens': ['nop'], 'raw': 'nop'}
            next_ID_EX = {'valid': False, 'pc': 0x00400000, 'rs1': 0, 'rs2': 0, 'rd': 0, 'rs1_val': 0, 'rs2_val': 0, 'imm': 0, 'mnemonic': 'nop', 'raw': 'nop', 'reg_write': False, 'mem_read': False, 'mem_write': False, 'branch': False, 'branch_cond': None, 'alu_src': False, 'alu_op': 'ADD', 'mem_to_reg': False}
            self.flushed = True
        else:
            inst_idx = (self.pc - 0x00400000) // 4
            if 0 <= inst_idx < len(self.program):
                inst = self.program[inst_idx]
                next_IF_ID = {
                    'valid': True,
                    'pc': self.pc,
                    'mnemonic': inst['mnemonic'],
                    'tokens': inst['tokens'],
                    'raw': inst['raw']
                }
                self.pc += 4

        self.IF_ID = next_IF_ID
        self.ID_EX = next_ID_EX
        self.EX_MEM = next_EX_MEM
        self.MEM_WB = next_MEM_WB

    def is_drained(self):
        past_end = ((self.pc - 0x00400000) // 4) >= len(self.program)
        return past_end and not (self.IF_ID['valid'] or self.ID_EX['valid'] or self.EX_MEM['valid'] or self.MEM_WB['valid'])

    def run(self, max_cycles=500):
        c = 0
        while not self.is_drained() and c < max_cycles:
            self.step()
            c += 1
        return self.registers

def run_tests():
    tests = [
        ("Control Unit: kop (ADD)", lambda: control_unit_decode('kop')['reg_write'] and control_unit_decode('kop')['alu_op'] == 'ADD'),
        ("Control Unit: ts (SUB)", lambda: control_unit_decode('ts')['reg_write'] and control_unit_decode('ts')['alu_op'] == 'SUB'),
        ("Control Unit: khh (ADDI)", lambda: control_unit_decode('khh')['alu_src'] and control_unit_decode('khh')['alu_op'] == 'ADD'),
        ("Control Unit: lt (LW)", lambda: control_unit_decode('lt')['mem_read'] and control_unit_decode('lt')['mem_to_reg']),
        ("Control Unit: blk (SW)", lambda: control_unit_decode('blk')['mem_write'] and not control_unit_decode('blk')['reg_write']),
        ("Control Unit: hlk (BEQ)", lambda: control_unit_decode('hlk')['branch'] and control_unit_decode('hlk')['branch_cond'] == 'EQ'),
        ("Control Unit: hft (BGT)", lambda: control_unit_decode('hft')['branch'] and control_unit_decode('hft')['branch_cond'] == 'GT'),
        ("Pipeline Step: Cycle 1 IF fetch", lambda: (lambda p: (p.load_program('khh r6, r0, 42'), p.step(), p.IF_ID['valid'] and p.pc == 0x00400004)[2])(LimoPipelineCore())),
        ("Pipeline Step: Cycle 5 WB commit", lambda: (lambda p: (p.load_program('khh r6, r0, 42'), p.run(), p.registers[6] == 42)[2])(LimoPipelineCore())),
        ("Invariant: r0 hardwired to zero", lambda: (lambda p: (p.load_program('khh r0, r0, 99'), p.run(), p.registers[0] == 0)[2])(LimoPipelineCore())),
        ("Hazard-free: Addition", lambda: (lambda p: (p.load_program('khh r6, r0, 12\nkhh r7, r0, 25\nkhh r1, r0, 0\nkhh r1, r0, 0\nkop r8, r6, r7'), p.run(), p.registers[8] == 37)[2])(LimoPipelineCore())),
        ("Hazard-free: Memory Store & Load", lambda: (lambda p: (p.load_program('khh r2, r0, 1000\nkhh r6, r0, 888\nkhh r1, r0, 0\nkhh r1, r0, 0\nblk r6, 4(r2)\nkhh r1, r0, 0\nkhh r1, r0, 0\nlt r9, 4(r2)'), p.run(), p.memory.get(1004) == 888 and p.registers[9] == 888)[2])(LimoPipelineCore())),
        ("Control Hazard: Branch Taken Penalty", lambda: (lambda p: (p.load_program('khh r6, r0, 10\nkhh r7, r0, 10\nkhh r1, r0, 0\nkhh r1, r0, 0\nhlk r6, r7, target\nkhh r8, r0, 1\nkhh r8, r0, 2\ntarget:\nkhh r9, r0, 99'), p.run(), p.registers[8] == 0 and p.registers[9] == 99)[2])(LimoPipelineCore())),
        ("System Dynamics: Reset", lambda: (lambda p: (p.load_program('khh r6, r0, 50'), p.step(), p.reset(), p.cycle == 0 and p.pc == 0x00400000 and not p.IF_ID['valid'])[3])(LimoPipelineCore()))
    ]

    print("\n======================================================")
    print("LIMO PIPELINE UNIT TEST SUITE (PYTHON) - MILESTONE M3")
    print("======================================================")
    passed = 0
    for idx, (name, fn) in enumerate(tests, 1):
        try:
            ok = fn()
            if ok:
                passed += 1
                print(f"[✓ PASS] #{idx} {name}")
            else:
                print(f"[✗ FAIL] #{idx} {name} (Returned False)")
        except Exception as e:
            print(f"[✗ FAIL] #{idx} {name} (Exception: {e})")

    print("------------------------------------------------------")
    print(f"TOTAL: {len(tests)} | PASSED: {passed} | FAILED: {len(tests) - passed}")
    print("======================================================\n")
    return len(tests) - passed

if __name__ == '__main__':
    sys.exit(run_tests())
