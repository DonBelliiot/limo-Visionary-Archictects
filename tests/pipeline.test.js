/**
 * ============================================================================
 * LIMO Studio - 5-Stage Pipeline Core Unit Test Suite (Milestone M3)
 * National University of Lesotho · Department of Computer Science
 * CS3520 Computer Organisation and Architecture
 * Team: Visionary Architects
 * ============================================================================
 *
 * This test suite verifies the 5-stage pipeline core, pipeline registers,
 * control unit, step/run/reset dynamics, register/memory state, and hazard-free
 * program execution according to the M2 & M3 specifications.
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    // Node.js environment
    module.exports = factory();
    if (require.main === module) {
      const runner = module.exports.runTests();
      process.exit(runner.failed > 0 ? 1 : 0);
    }
  } else {
    // Browser environment
    root.LimoPipelineTests = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. CONTROL UNIT IMPLEMENTATION
  // --------------------------------------------------------------------------
  const ControlUnit = {
    decode(mnemonic) {
      if (!mnemonic) {
        return {
          valid: false,
          regWrite: false,
          aluSrc: false,
          aluOp: 'ADD',
          memRead: false,
          memWrite: false,
          branch: false,
          branchCondition: null,
          memToReg: false
        };
      }

      const m = mnemonic.toLowerCase().trim();
      switch (m) {
        case 'kop':
        case 'add':
          return { valid: true, regWrite: true, aluSrc: false, aluOp: 'ADD', memRead: false, memWrite: false, branch: false, branchCondition: null, memToReg: false };

        case 'ts':
        case 'sub':
          return { valid: true, regWrite: true, aluSrc: false, aluOp: 'SUB', memRead: false, memWrite: false, branch: false, branchCondition: null, memToReg: false };

        case 'khh':
        case 'addi':
          return { valid: true, regWrite: true, aluSrc: true, aluOp: 'ADD', memRead: false, memWrite: false, branch: false, branchCondition: null, memToReg: false };

        case 'le':
        case 'and':
          return { valid: true, regWrite: true, aluSrc: false, aluOp: 'AND', memRead: false, memWrite: false, branch: false, branchCondition: null, memToReg: false };

        case 'kp':
        case 'or':
          return { valid: true, regWrite: true, aluSrc: false, aluOp: 'OR', memRead: false, memWrite: false, branch: false, branchCondition: null, memToReg: false };

        case 'ng':
        case 'sll':
        case 'slli':
          return { valid: true, regWrite: true, aluSrc: false, aluOp: 'SLL', memRead: false, memWrite: false, branch: false, branchCondition: null, memToReg: false };

        case 'lt':
        case 'lw':
          return { valid: true, regWrite: true, aluSrc: true, aluOp: 'ADD', memRead: true, memWrite: false, branch: false, branchCondition: null, memToReg: true };

        case 'blk':
        case 'sw':
          return { valid: true, regWrite: false, aluSrc: true, aluOp: 'ADD', memRead: false, memWrite: true, branch: false, branchCondition: null, memToReg: false };

        case 'hlk':
        case 'beq':
          return { valid: true, regWrite: false, aluSrc: false, aluOp: 'SUB', memRead: false, memWrite: false, branch: true, branchCondition: 'EQ', memToReg: false };

        case 'hft':
        case 'bgt':
          return { valid: true, regWrite: false, aluSrc: false, aluOp: 'SUB', memRead: false, memWrite: false, branch: true, branchCondition: 'GT', memToReg: false };

        default:
          return { valid: false, regWrite: false, aluSrc: false, aluOp: 'ADD', memRead: false, memWrite: false, branch: false, branchCondition: null, memToReg: false };
      }
    }
  };

  // --------------------------------------------------------------------------
  // 2. REGISTER FILE & ADDRESS PARSER
  // --------------------------------------------------------------------------
  const LIMO_REGISTERS = {
    r0: 0, letho: 0, zero: 0, x0: 0,
    r1: 1, khutlisa: 1, ra: 1, x1: 1,
    r2: 2, tshupo: 2, sp: 2, x2: 2,
    r3: 3, sebali: 3, pc: 3, x3: 3,
    r4: 4, sesupi: 4, gp: 4, x4: 4,
    r5: 5, lesupa: 5, fp: 5, x5: 5,
    r6: 6, thuso0: 6, a0: 6, x6: 6,
    r7: 7, thuso1: 7, a1: 7, x7: 7,
    r8: 8, nakoana0: 8, t0: 8, x8: 8,
    r9: 9, nakoana1: 9, t1: 9, x9: 9,
    r10: 10, nakoana2: 10, t2: 10, x10: 10,
    r11: 11, nakoana3: 11, t3: 11, x11: 11,
    r12: 12, nakoana4: 12, t4: 12, x12: 12,
    r13: 13, nakoana5: 13, t5: 13, x13: 13,
    r14: 14, nakoana6: 14, t6: 14, x14: 14,
    r15: 15, nakoana7: 15, t7: 15, x15: 15,
    r16: 16, polokelo0: 16, s0: 16, x16: 16,
    r17: 17, polokelo1: 17, s1: 17, x17: 17,
    r18: 18, polokelo2: 18, s2: 18, x18: 18,
    r19: 19, polokelo3: 19, s3: 19, x19: 19,
    r20: 20, polokelo4: 20, s4: 20, x20: 20,
    r21: 21, polokelo5: 21, s5: 21, x21: 21,
    r22: 22, polokelo6: 22, s6: 22, x22: 22,
    r23: 23, polokelo7: 23, s7: 23, x23: 23,
    r24: 24, polokelo8: 24, s8: 24, x24: 24,
    r25: 25, polokelo9: 25, s9: 25, x25: 25,
    r26: 26, polokelo10: 26, s10: 26, x26: 26,
    r27: 27, polokelo11: 27, s11: 27, x27: 27,
    r28: 28, tsehlahlamang0: 28, t8: 28, x28: 28,
    r29: 29, tsehlahlamang1: 29, t9: 29, x29: 29,
    r30: 30, tsehlahlamang2: 30, t10: 30, x30: 30,
    r31: 31, tsehlahlamang3: 31, t11: 31, x31: 31,
  };

  function parseReg(token) {
    if (!token) return null;
    const clean = token.trim().toLowerCase().replace(/,$/, '');
    const m = clean.match(/^([rx]\d+|[a-z0-9]+)$/);
    if (!m) return null;
    const key = m[1];
    if (Object.prototype.hasOwnProperty.call(LIMO_REGISTERS, key)) {
      return LIMO_REGISTERS[key];
    }
    return null;
  }

  function parseInstruction(rawText, pc = 0x00400000) {
    const cleaned = rawText.split(/[#;]/)[0].trim();
    if (!cleaned) return null;
    const tokens = cleaned.split(/[\s,()]+/).filter(Boolean);
    if (tokens.length === 0) return null;
    return {
      raw: rawText.trim(),
      cleaned,
      mnemonic: tokens[0].toLowerCase(),
      tokens,
      pc
    };
  }

  // --------------------------------------------------------------------------
  // 3. PIPELINE REGISTER FACTORIES
  // --------------------------------------------------------------------------
  function createBubbleIF_ID() {
    return { valid: false, pc: 0x00400000, instruction: 0x00000013, hex: '0x00000013', rawAssembly: 'nop', mnemonic: 'nop', tokens: ['nop'], lineNum: 0 };
  }

  function createBubbleID_EX() {
    return {
      valid: false,
      pc: 0x00400000,
      rs1: 0,
      rs2: 0,
      rd: 0,
      rs1_val: 0,
      rs2_val: 0,
      imm: 0,
      mnemonic: 'nop',
      rawAssembly: 'nop',
      regWrite: false,
      memRead: false,
      memWrite: false,
      branch: false,
      branchCondition: null,
      aluSrc: false,
      aluOp: 'ADD',
      memToReg: false
    };
  }

  function createBubbleEX_MEM() {
    return {
      valid: false,
      pc: 0x00400000,
      aluResult: 0,
      storeData: 0,
      branchTarget: 0,
      branchTaken: false,
      rd: 0,
      mnemonic: 'nop',
      rawAssembly: 'nop',
      regWrite: false,
      memRead: false,
      memWrite: false,
      memToReg: false
    };
  }

  function createBubbleMEM_WB() {
    return {
      valid: false,
      pc: 0x00400000,
      memReadData: 0,
      aluResult: 0,
      writeBackData: 0,
      rd: 0,
      mnemonic: 'nop',
      rawAssembly: 'nop',
      regWrite: false,
      memToReg: false
    };
  }

  // --------------------------------------------------------------------------
  // 4. PIPELINE CORE SIMULATOR
  // --------------------------------------------------------------------------
  class LimoPipelineCore {
    constructor() {
      this.reset();
    }

    reset() {
      this.registers = new Array(32).fill(0);
      this.registers[2] = 0x7FFFFFF0; // SP
      this.memory = {};
      this.pc = 0x00400000;
      this.cycle = 0;
      this.instructionsRetired = 0;
      this.flushed = false;
      this.stalled = false;
      this.lastWrittenReg = null;
      this.lastWrittenMem = null;

      this.IF_ID = createBubbleIF_ID();
      this.ID_EX = createBubbleID_EX();
      this.EX_MEM = createBubbleEX_MEM();
      this.MEM_WB = createBubbleMEM_WB();

      this.program = [];
      this.labelMap = new Map();
      this.history = [];
    }

    loadProgram(sourceCode) {
      this.reset();
      const lines = sourceCode.split('\n');
      this.program = [];
      this.labelMap = new Map();

      lines.forEach((line) => {
        const noComment = line.split(/[#;]/)[0].trim();
        if (!noComment || noComment.startsWith('.')) return;

        let working = noComment;
        const labelMatch = working.match(/^([a-zA-Z_][a-zA-Z0-9_]*):/);
        if (labelMatch) {
          this.labelMap.set(labelMatch[1].toLowerCase(), this.program.length);
          working = working.slice(labelMatch[0].length).trim();
        }

        if (!working) return;
        const parsed = parseInstruction(working, 0x00400000 + this.program.length * 4);
        if (parsed) {
          this.program.push(parsed);
        }
      });
    }

    step() {
      this.cycle++;
      this.flushed = false;
      this.stalled = false;
      this.lastWrittenReg = null;
      this.lastWrittenMem = null;

      // ----------------------------------------------------------------------
      // STAGE 5: WRITE-BACK (WB)
      // ----------------------------------------------------------------------
      if (this.MEM_WB.valid) {
        if (this.MEM_WB.regWrite && this.MEM_WB.rd !== 0) {
          this.registers[this.MEM_WB.rd] = this.MEM_WB.writeBackData | 0;
          this.lastWrittenReg = this.MEM_WB.rd;
        }
        // Invariant: r0 is always 0
        this.registers[0] = 0;
        this.instructionsRetired++;
      }

      // ----------------------------------------------------------------------
      // STAGE 4: MEMORY ACCESS (MEM)
      // ----------------------------------------------------------------------
      let next_MEM_WB = createBubbleMEM_WB();
      if (this.EX_MEM.valid) {
        let memReadData = 0;
        if (this.EX_MEM.memRead) {
          memReadData = this.memory[this.EX_MEM.aluResult] !== undefined ? this.memory[this.EX_MEM.aluResult] : 0;
        }
        if (this.EX_MEM.memWrite) {
          this.memory[this.EX_MEM.aluResult] = this.EX_MEM.storeData | 0;
          this.lastWrittenMem = this.EX_MEM.aluResult;
        }

        const wbData = this.EX_MEM.memToReg ? memReadData : this.EX_MEM.aluResult;
        next_MEM_WB = {
          valid: true,
          pc: this.EX_MEM.pc,
          memReadData,
          aluResult: this.EX_MEM.aluResult,
          writeBackData: wbData,
          rd: this.EX_MEM.rd,
          mnemonic: this.EX_MEM.mnemonic,
          rawAssembly: this.EX_MEM.rawAssembly,
          regWrite: this.EX_MEM.regWrite,
          memToReg: this.EX_MEM.memToReg
        };
      }

      // ----------------------------------------------------------------------
      // STAGE 3: EXECUTE (EX)
      // ----------------------------------------------------------------------
      let next_EX_MEM = createBubbleEX_MEM();
      let branchTaken = false;
      let branchTarget = 0;

      if (this.ID_EX.valid) {
        const opA = this.ID_EX.rs1_val;
        const opB = this.ID_EX.aluSrc ? this.ID_EX.imm : this.ID_EX.rs2_val;
        let aluResult = 0;

        switch (this.ID_EX.aluOp) {
          case 'ADD':
            aluResult = (opA + opB) | 0;
            break;
          case 'SUB':
            aluResult = (opA - opB) | 0;
            break;
          case 'AND':
            aluResult = (opA & opB) | 0;
            break;
          case 'OR':
            aluResult = (opA | opB) | 0;
            break;
          case 'SLL':
            aluResult = (opA << (opB & 0x1f)) | 0;
            break;
          default:
            aluResult = (opA + opB) | 0;
            break;
        }

        // Branch evaluation (Zero-flag direct compare)
        if (this.ID_EX.branch) {
          if (this.ID_EX.branchCondition === 'EQ') {
            branchTaken = (this.ID_EX.rs1_val === this.ID_EX.rs2_val);
          } else if (this.ID_EX.branchCondition === 'GT') {
            branchTaken = ((this.ID_EX.rs1_val | 0) > (this.ID_EX.rs2_val | 0));
          }
          branchTarget = (this.ID_EX.pc + this.ID_EX.imm) | 0;
        }

        next_EX_MEM = {
          valid: true,
          pc: this.ID_EX.pc,
          aluResult,
          storeData: this.ID_EX.rs2_val,
          branchTarget,
          branchTaken,
          rd: this.ID_EX.rd,
          mnemonic: this.ID_EX.mnemonic,
          rawAssembly: this.ID_EX.rawAssembly,
          regWrite: this.ID_EX.regWrite,
          memRead: this.ID_EX.memRead,
          memWrite: this.ID_EX.memWrite,
          memToReg: this.ID_EX.memToReg
        };
      }

      // ----------------------------------------------------------------------
      // STAGE 2: INSTRUCTION DECODE (ID)
      // ----------------------------------------------------------------------
      let next_ID_EX = createBubbleID_EX();
      if (this.IF_ID.valid) {
        const tokens = this.IF_ID.tokens;
        const mnemonic = this.IF_ID.mnemonic;
        const ctrl = ControlUnit.decode(mnemonic);

        let rd = 0;
        let rs1 = 0;
        let rs2 = 0;
        let imm = 0;

        if (mnemonic === 'kop' || mnemonic === 'ts' || mnemonic === 'le' || mnemonic === 'kp' || mnemonic === 'ng' ||
            mnemonic === 'add' || mnemonic === 'sub' || mnemonic === 'and' || mnemonic === 'or' || mnemonic === 'sll') {
          rd = parseReg(tokens[1]) || 0;
          rs1 = parseReg(tokens[2]) || 0;
          rs2 = parseReg(tokens[3]) || 0;
        } else if (mnemonic === 'khh' || mnemonic === 'addi') {
          rd = parseReg(tokens[1]) || 0;
          rs1 = parseReg(tokens[2]) || 0;
          imm = parseInt(tokens[3], 10) || 0;
        } else if (mnemonic === 'lt' || mnemonic === 'lw') {
          rd = parseReg(tokens[1]) || 0;
          if (tokens.length >= 4) {
            imm = parseInt(tokens[2], 10) || 0;
            rs1 = parseReg(tokens[3]) || 0;
          } else if (tokens[2]) {
            const m = tokens[2].match(/^(-?\d+)?\(?([^)]+)\)?/);
            if (m) {
              imm = parseInt(m[1] || '0', 10);
              rs1 = parseReg(m[2]) || 0;
            }
          }
        } else if (mnemonic === 'blk' || mnemonic === 'sw') {
          rs2 = parseReg(tokens[1]) || 0;
          if (tokens.length >= 4) {
            imm = parseInt(tokens[2], 10) || 0;
            rs1 = parseReg(tokens[3]) || 0;
          } else if (tokens[2]) {
            const m = tokens[2].match(/^(-?\d+)?\(?([^)]+)\)?/);
            if (m) {
              imm = parseInt(m[1] || '0', 10);
              rs1 = parseReg(m[2]) || 0;
            }
          }
        } else if (mnemonic === 'hlk' || mnemonic === 'hft' || mnemonic === 'beq' || mnemonic === 'bgt') {
          rs1 = parseReg(tokens[1]) || 0;
          rs2 = parseReg(tokens[2]) || 0;
          const targetToken = (tokens[3] || '').replace(/^\+/, '').toLowerCase();
          if (this.labelMap.has(targetToken)) {
            const targetIdx = this.labelMap.get(targetToken);
            const targetAddress = 0x00400000 + targetIdx * 4;
            imm = targetAddress - this.IF_ID.pc;
          } else {
            imm = parseInt(targetToken, 10) || 0;
          }
        }

        // Read register file
        const rs1_val = (rs1 === 0 ? 0 : (this.registers[rs1] || 0));
        const rs2_val = (rs2 === 0 ? 0 : (this.registers[rs2] || 0));

        next_ID_EX = {
          valid: true,
          pc: this.IF_ID.pc,
          rs1,
          rs2,
          rd,
          rs1_val,
          rs2_val,
          imm,
          mnemonic,
          rawAssembly: this.IF_ID.rawAssembly,
          regWrite: ctrl.regWrite,
          memRead: ctrl.memRead,
          memWrite: ctrl.memWrite,
          branch: ctrl.branch,
          branchCondition: ctrl.branchCondition,
          aluSrc: ctrl.aluSrc,
          aluOp: ctrl.aluOp,
          memToReg: ctrl.memToReg
        };
      }

      // ----------------------------------------------------------------------
      // STAGE 1: INSTRUCTION FETCH (IF)
      // ----------------------------------------------------------------------
      let next_IF_ID = createBubbleIF_ID();

      if (branchTaken) {
        // Control hazard: branch taken flushes speculative IF and ID instructions
        this.pc = branchTarget;
        next_IF_ID = createBubbleIF_ID();
        next_ID_EX = createBubbleID_EX();
        this.flushed = true;
      } else {
        const instIdx = Math.floor((this.pc - 0x00400000) / 4);
        if (instIdx >= 0 && instIdx < this.program.length) {
          const current = this.program[instIdx];
          next_IF_ID = {
            valid: true,
            pc: this.pc,
            instruction: 0,
            hex: '0x00000000',
            rawAssembly: current.raw,
            mnemonic: current.mnemonic,
            tokens: current.tokens,
            lineNum: instIdx + 1
          };
          this.pc += 4;
        } else {
          next_IF_ID = createBubbleIF_ID();
        }
      }

      // Synchronous latch of all pipeline registers
      this.IF_ID = next_IF_ID;
      this.ID_EX = next_ID_EX;
      this.EX_MEM = next_EX_MEM;
      this.MEM_WB = next_MEM_WB;

      return {
        cycle: this.cycle,
        flushed: this.flushed,
        retired: this.instructionsRetired,
        pc: this.pc,
        isDrained: this.isDrained()
      };
    }

    isDrained() {
      const pastEnd = Math.floor((this.pc - 0x00400000) / 4) >= this.program.length;
      return pastEnd && !this.IF_ID.valid && !this.ID_EX.valid && !this.EX_MEM.valid && !this.MEM_WB.valid;
    }

    run(maxCycles = 500) {
      let c = 0;
      while (!this.isDrained() && c < maxCycles) {
        this.step();
        c++;
      }
      return {
        cycles: this.cycle,
        instructionsRetired: this.instructionsRetired,
        cpi: this.instructionsRetired > 0 ? (this.cycle / this.instructionsRetired).toFixed(2) : 0,
        registers: [...this.registers],
        memory: Object.assign({}, this.memory),
        isDrained: this.isDrained()
      };
    }
  }

  // --------------------------------------------------------------------------
  // 5. TEST CASES SUITE
  // --------------------------------------------------------------------------
  const PIPELINE_TEST_CASES = [
    // --- Category: Control Unit Decoding ---
    {
      id: 1,
      category: 'Control Unit',
      name: 'Control Unit: kop (ADD) signals',
      fn: () => {
        const c = ControlUnit.decode('kop');
        return c.regWrite === true && c.aluSrc === false && c.aluOp === 'ADD' && c.memRead === false && c.memWrite === false && c.branch === false && c.memToReg === false;
      },
      desc: 'Verifies kop produces RegWrite=1, ALUSrc=0, ALUOp=ADD, MemToReg=0'
    },
    {
      id: 2,
      category: 'Control Unit',
      name: 'Control Unit: ts (SUB) signals',
      fn: () => {
        const c = ControlUnit.decode('ts');
        return c.regWrite === true && c.aluSrc === false && c.aluOp === 'SUB' && c.memRead === false && c.memWrite === false && c.branch === false && c.memToReg === false;
      },
      desc: 'Verifies ts produces RegWrite=1, ALUSrc=0, ALUOp=SUB, MemToReg=0'
    },
    {
      id: 3,
      category: 'Control Unit',
      name: 'Control Unit: khh (ADDI) signals',
      fn: () => {
        const c = ControlUnit.decode('khh');
        return c.regWrite === true && c.aluSrc === true && c.aluOp === 'ADD' && c.memRead === false && c.memWrite === false && c.branch === false && c.memToReg === false;
      },
      desc: 'Verifies khh produces RegWrite=1, ALUSrc=1 (immediate), ALUOp=ADD, MemToReg=0'
    },
    {
      id: 4,
      category: 'Control Unit',
      name: 'Control Unit: le (AND) and kp (OR) signals',
      fn: () => {
        const c1 = ControlUnit.decode('le');
        const c2 = ControlUnit.decode('kp');
        return c1.regWrite === true && c1.aluOp === 'AND' && c2.regWrite === true && c2.aluOp === 'OR';
      },
      desc: 'Verifies bitwise logic control signals'
    },
    {
      id: 5,
      category: 'Control Unit',
      name: 'Control Unit: ng (SLL) signals',
      fn: () => {
        const c = ControlUnit.decode('ng');
        return c.regWrite === true && c.aluSrc === false && c.aluOp === 'SLL' && c.memToReg === false;
      },
      desc: 'Verifies shift left logical signals'
    },
    {
      id: 6,
      category: 'Control Unit',
      name: 'Control Unit: lt (LW load word) signals',
      fn: () => {
        const c = ControlUnit.decode('lt');
        return c.regWrite === true && c.aluSrc === true && c.memRead === true && c.memWrite === false && c.memToReg === true;
      },
      desc: 'Verifies lt produces RegWrite=1, ALUSrc=1, MemRead=1, MemToReg=1'
    },
    {
      id: 7,
      category: 'Control Unit',
      name: 'Control Unit: blk (SW store word) signals',
      fn: () => {
        const c = ControlUnit.decode('blk');
        return c.regWrite === false && c.aluSrc === true && c.memRead === false && c.memWrite === true && c.memToReg === false;
      },
      desc: 'Verifies blk produces RegWrite=0, ALUSrc=1, MemWrite=1'
    },
    {
      id: 8,
      category: 'Control Unit',
      name: 'Control Unit: hlk (BEQ) and hft (BGT) signals',
      fn: () => {
        const c1 = ControlUnit.decode('hlk');
        const c2 = ControlUnit.decode('hft');
        return c1.branch === true && c1.branchCondition === 'EQ' && c1.regWrite === false &&
               c2.branch === true && c2.branchCondition === 'GT' && c2.regWrite === false;
      },
      desc: 'Verifies direct branch comparator modes (EQ and GT)'
    },

    // --- Category: Pipeline Registers & State ---
    {
      id: 9,
      category: 'Pipeline Registers',
      name: 'Pipeline Registers: Initial reset bubbles',
      fn: () => {
        const pipe = new LimoPipelineCore();
        return pipe.cycle === 0 &&
               pipe.IF_ID.valid === false &&
               pipe.ID_EX.valid === false &&
               pipe.EX_MEM.valid === false &&
               pipe.MEM_WB.valid === false &&
               pipe.registers[0] === 0 &&
               pipe.registers[2] === 0x7FFFFFF0;
      },
      desc: 'Verifies pipeline registers initialize to invalid bubbles and SP=0x7FFFFFF0'
    },
    {
      id: 10,
      category: 'Pipeline Registers',
      name: 'Pipeline Cycle 1: IF Stage fetches first instruction',
      fn: () => {
        const pipe = new LimoPipelineCore();
        pipe.loadProgram('khh r6, r0, 42');
        pipe.step();
        return pipe.cycle === 1 &&
               pipe.IF_ID.valid === true &&
               pipe.IF_ID.mnemonic === 'khh' &&
               pipe.pc === 0x00400004 &&
               pipe.ID_EX.valid === false;
      },
      desc: 'Verifies Cycle 1 latches fetched instruction into IF/ID and increments PC to 0x00400004'
    },
    {
      id: 11,
      category: 'Pipeline Registers',
      name: 'Pipeline Cycle 2: ID Stage decodes operands into ID/EX',
      fn: () => {
        const pipe = new LimoPipelineCore();
        pipe.loadProgram('khh r6, r0, 42');
        pipe.step(); // cycle 1 (IF)
        pipe.step(); // cycle 2 (ID)
        return pipe.cycle === 2 &&
               pipe.ID_EX.valid === true &&
               pipe.ID_EX.rd === 6 &&
               pipe.ID_EX.rs1 === 0 &&
               pipe.ID_EX.imm === 42 &&
               pipe.ID_EX.regWrite === true &&
               pipe.EX_MEM.valid === false;
      },
      desc: 'Verifies Cycle 2 latches decoded fields and control signals into ID/EX'
    },
    {
      id: 12,
      category: 'Pipeline Registers',
      name: 'Pipeline Cycle 3: EX Stage executes ALU operation',
      fn: () => {
        const pipe = new LimoPipelineCore();
        pipe.loadProgram('khh r6, r0, 42');
        pipe.step(); // cycle 1 (IF)
        pipe.step(); // cycle 2 (ID)
        pipe.step(); // cycle 3 (EX)
        return pipe.cycle === 3 &&
               pipe.EX_MEM.valid === true &&
               pipe.EX_MEM.aluResult === 42 &&
               pipe.EX_MEM.rd === 6 &&
               pipe.registers[6] === 0; // Not yet written back to registers!
      },
      desc: 'Verifies Cycle 3 executes ALU and places result in EX/MEM before register file write'
    },
    {
      id: 13,
      category: 'Pipeline Registers',
      name: 'Pipeline Cycle 4: MEM Stage propagates to MEM/WB',
      fn: () => {
        const pipe = new LimoPipelineCore();
        pipe.loadProgram('khh r6, r0, 42');
        pipe.step(); // 1
        pipe.step(); // 2
        pipe.step(); // 3
        pipe.step(); // 4
        return pipe.cycle === 4 &&
               pipe.MEM_WB.valid === true &&
               pipe.MEM_WB.writeBackData === 42 &&
               pipe.MEM_WB.rd === 6 &&
               pipe.registers[6] === 0; // Still waiting for WB rising clock!
      },
      desc: 'Verifies Cycle 4 passes computed value through MEM stage to MEM/WB'
    },
    {
      id: 14,
      category: 'Pipeline Registers',
      name: 'Pipeline Cycle 5: WB Stage commits to register file',
      fn: () => {
        const pipe = new LimoPipelineCore();
        pipe.loadProgram('khh r6, r0, 42');
        pipe.step(); // 1
        pipe.step(); // 2
        pipe.step(); // 3
        pipe.step(); // 4
        pipe.step(); // 5
        return pipe.cycle === 5 &&
               pipe.registers[6] === 42 &&
               pipe.instructionsRetired === 1 &&
               pipe.isDrained();
      },
      desc: 'Verifies Cycle 5 commits writeBackData into R[rd] and retires the instruction'
    },
    {
      id: 15,
      category: 'Hardware Invariant',
      name: 'Register File: r0 (Letho) hardwired to zero',
      fn: () => {
        const pipe = new LimoPipelineCore();
        pipe.loadProgram('khh r0, r0, 99');
        pipe.run();
        return pipe.registers[0] === 0;
      },
      desc: 'Verifies writes to r0 in WB stage are discarded to maintain constant zero'
    },

    // --- Category: Hazard-Free Execution ---
    {
      id: 16,
      category: 'Hazard-Free Execution',
      name: 'Hazard-free addition: khh + khh + 2 NOPs + kop',
      fn: () => {
        const prog = `
          khh r6, r0, 12       # r6 = 12
          khh r7, r0, 25       # r7 = 25
          khh r1, r0, 0        # independent NOP
          khh r1, r0, 0        # independent NOP
          kop r8, r6, r7       # r8 = r6 + r7 = 37
        `;
        const pipe = new LimoPipelineCore();
        pipe.loadProgram(prog);
        const res = pipe.run();
        return pipe.registers[6] === 12 && pipe.registers[7] === 25 && pipe.registers[8] === 37;
      },
      desc: 'Verifies hazard-free arithmetic program computes exact architectural register values'
    },
    {
      id: 17,
      category: 'Hazard-Free Execution',
      name: 'Hazard-free subtraction: khh + khh + 2 NOPs + ts',
      fn: () => {
        const prog = `
          khh r6, r0, 50
          khh r7, r0, 18
          khh r1, r0, 0
          khh r1, r0, 0
          ts  r8, r6, r7       # r8 = 50 - 18 = 32
        `;
        const pipe = new LimoPipelineCore();
        pipe.loadProgram(prog);
        pipe.run();
        return pipe.registers[8] === 32;
      },
      desc: 'Verifies hazard-free subtraction execution'
    },
    {
      id: 18,
      category: 'Hazard-Free Execution',
      name: 'Hazard-free logic: le (AND) and kp (OR)',
      fn: () => {
        const prog = `
          khh r6, r0, 12       # 0b1100
          khh r7, r0, 5        # 0b0101
          khh r1, r0, 0
          khh r1, r0, 0
          le  r8, r6, r7       # 12 & 5 = 4
          kp  r9, r6, r7       # 12 | 5 = 13
        `;
        const pipe = new LimoPipelineCore();
        pipe.loadProgram(prog);
        pipe.run();
        return pipe.registers[8] === 4 && pipe.registers[9] === 13;
      },
      desc: 'Verifies bitwise AND and OR in hazard-free sequence'
    },
    {
      id: 19,
      category: 'Hazard-Free Execution',
      name: 'Hazard-free shift: ng (SLL)',
      fn: () => {
        const prog = `
          khh r6, r0, 5
          khh r7, r0, 3
          khh r1, r0, 0
          khh r1, r0, 0
          ng  r8, r6, r7       # 5 << 3 = 40
        `;
        const pipe = new LimoPipelineCore();
        pipe.loadProgram(prog);
        pipe.run();
        return pipe.registers[8] === 40;
      },
      desc: 'Verifies shift left logical in hazard-free sequence'
    },
    {
      id: 20,
      category: 'Hazard-Free Execution',
      name: 'Hazard-free memory store and load (blk & lt)',
      fn: () => {
        const prog = `
          khh r2, r0, 1000     # base address
          khh r6, r0, 777      # value to store
          khh r1, r0, 0
          khh r1, r0, 0
          blk r6, 4(r2)        # Mem[1004] = 777
          khh r1, r0, 0
          khh r1, r0, 0
          lt  r9, 4(r2)        # r9 = Mem[1004] = 777
        `;
        const pipe = new LimoPipelineCore();
        pipe.loadProgram(prog);
        pipe.run();
        return pipe.memory[1004] === 777 && pipe.registers[9] === 777;
      },
      desc: 'Verifies store word writes to data memory and load word retrieves stored data'
    },
    {
      id: 21,
      category: 'Control Hazard',
      name: 'Branch taken penalty: 2 speculative flushes',
      fn: () => {
        const prog = `
          khh r6, r0, 10
          khh r7, r0, 10
          khh r1, r0, 0
          khh r1, r0, 0
          hlk r6, r7, target   # Branch taken (10 == 10)
          khh r8, r0, 1        # Speculative inst 1 (should be flushed!)
          khh r8, r0, 2        # Speculative inst 2 (should be flushed!)
        target:
          khh r9, r0, 99       # Target inst
        `;
        const pipe = new LimoPipelineCore();
        pipe.loadProgram(prog);
        pipe.run();
        return pipe.registers[8] === 0 && pipe.registers[9] === 99;
      },
      desc: 'Verifies branch taken flushes 2 speculative instructions (IF/ID & ID/EX)'
    },
    {
      id: 22,
      category: 'Control Hazard',
      name: 'Branch not taken: fall-through without flushes',
      fn: () => {
        const prog = `
          khh r6, r0, 10
          khh r7, r0, 20
          khh r1, r0, 0
          khh r1, r0, 0
          hlk r6, r7, skip     # Not taken (10 != 20)
          khh r8, r0, 55       # Should execute!
        skip:
          khh r9, r0, 88       # Should execute!
        `;
        const pipe = new LimoPipelineCore();
        pipe.loadProgram(prog);
        pipe.run();
        return pipe.registers[8] === 55 && pipe.registers[9] === 88;
      },
      desc: 'Verifies branch not taken falls through sequentially'
    },
    {
      id: 23,
      category: 'Control Hazard',
      name: 'Branch greater than (hft): conditional comparison',
      fn: () => {
        const prog = `
          khh r6, r0, 25
          khh r7, r0, 10
          khh r1, r0, 0
          khh r1, r0, 0
          hft r6, r7, gt_target # Taken (25 > 10)
          khh r8, r0, 100       # Flushed
        gt_target:
          khh r10, r0, 1        # Executed
        `;
        const pipe = new LimoPipelineCore();
        pipe.loadProgram(prog);
        pipe.run();
        return pipe.registers[8] === 0 && pipe.registers[10] === 1;
      },
      desc: 'Verifies hft flag-less comparison branching when rs1 > rs2'
    },
    {
      id: 24,
      category: 'Full ISA Benchmark',
      name: 'Benchmark: Average / Midpoint hazard-free program',
      fn: () => {
        const prog = `
          khh r6, r0, 18       # a = 18
          khh r7, r0, 42       # b = 42
          khh r1, r0, 0
          khh r1, r0, 0
          kop r8, r6, r7       # r8 = 18 + 42 = 60
          khh r9, r0, 1        # r9 = 1 (shift amount)
          khh r1, r0, 0
          khh r1, r0, 0
          ng  r10, r8, r9      # r10 = 60 << 1 = 120
        `;
        const pipe = new LimoPipelineCore();
        pipe.loadProgram(prog);
        pipe.run();
        return pipe.registers[8] === 60 && pipe.registers[10] === 120;
      },
      desc: 'Verifies full arithmetic and logic benchmark runs correctly end-to-end'
    },
    {
      id: 25,
      category: 'System Dynamics',
      name: 'Step / Run / Reset state transitions',
      fn: () => {
        const pipe = new LimoPipelineCore();
        pipe.loadProgram('khh r6, r0, 100\nkhh r7, r0, 200');
        pipe.step();
        pipe.step();
        const cycleBeforeReset = pipe.cycle;
        pipe.reset();
        const cycleAfterReset = pipe.cycle;
        const pcAfterReset = pipe.pc;
        const validAfterReset = pipe.IF_ID.valid || pipe.ID_EX.valid || pipe.EX_MEM.valid || pipe.MEM_WB.valid;
        return cycleBeforeReset === 2 && cycleAfterReset === 0 && pcAfterReset === 0x00400000 && !validAfterReset;
      },
      desc: 'Verifies Reset restores pipeline registers, PC, and cycle count to clean state'
    }
  ];

  // --------------------------------------------------------------------------
  // 6. TEST RUNNER
  // --------------------------------------------------------------------------
  function runTests() {
    const startTime = typeof performance !== 'undefined' ? performance.now() : Date.now();
    let passedCount = 0;
    let failedCount = 0;
    const results = [];

    PIPELINE_TEST_CASES.forEach((test) => {
      let passed = false;
      let errorMsg = '';
      try {
        passed = test.fn() === true;
        if (!passed) errorMsg = 'Condition returned false';
      } catch (err) {
        passed = false;
        errorMsg = err.message || String(err);
      }

      if (passed) passedCount++;
      else failedCount++;

      results.push({
        id: test.id,
        category: test.category,
        name: test.name,
        passed,
        reason: errorMsg,
        desc: test.desc
      });
    });

    const endTime = typeof performance !== 'undefined' ? performance.now() : Date.now();
    const durationMs = Math.round((endTime - startTime) * 10) / 10;

    const summary = {
      total: PIPELINE_TEST_CASES.length,
      passed: passedCount,
      failed: failedCount,
      durationMs,
      passRate: Math.round((passedCount / PIPELINE_TEST_CASES.length) * 100),
      results
    };

    if (typeof console !== 'undefined') {
      console.log(`\n======================================================`);
      console.log(`LIMO 5-STAGE PIPELINE CORE UNIT TEST SUITE - MILESTONE M3`);
      console.log(`======================================================`);
      results.forEach((r) => {
        const badge = r.passed ? '✓ PASS' : '✗ FAIL';
        console.log(`[${badge}] #${r.id} ${r.name}`);
        if (!r.passed) {
          console.log(`       Reason: ${r.reason}`);
        }
      });
      console.log(`------------------------------------------------------`);
      console.log(`TOTAL: ${summary.total} | PASSED: ${summary.passed} | FAILED: ${summary.failed} | TIME: ${summary.durationMs}ms`);
      console.log(`======================================================\n`);
    }

    return summary;
  }

  return {
    ControlUnit,
    LimoPipelineCore,
    PIPELINE_TEST_CASES,
    runTests
  };
});
