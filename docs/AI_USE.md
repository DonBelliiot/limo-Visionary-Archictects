# AI Disclosure Statement (`Ai_use.md`)

**Course:** CS3520 – Computer Architecture / System Design  
**Institution:** National University of Lesotho · Department of Computer Science  
**Project:** LIMO Studio (Visionary Architects – RV32I Sesotho ISA Emulator & 5-Stage Pipeline Visualizer)  
**Deliverable:** Milestones M1, M2 & M3 Systems, Web Architecture & Pipeline Core  

---

## 1. Overview & Purpose

This document outlines the scope, nature, and extent of Artificial Intelligence (AI) tool usage in the planning, development, testing, and UI/UX design of **LIMO Studio** (accessible online at [thmn123.github.io/limo-Visionary-Architects](https://thmn123.github.io/limo-Visionary-Architects/)). 

In accordance with academic integrity guidelines, AI was utilized as an interactive assistant for code generation, interface prototyping, architectural verification, and test case design, while all underlying hardware architectural principles (Sesotho ISA translation, Zero-Flag architecture, 5-stage pipeline datapath design, synchronous cycle stepping, hazard-free execution) were conceptualized and validated by the project authors.

---

## 2. Tools Used

* **Large Language Models (LLMs):** OpenAI ChatGPT / Anthropic Claude / Google Gemini (or equivalent coding assistants).
* **AI Code Assistants:** GitHub Copilot / Cursor (for IDE code autocompletion and structural boilerplate).

---

## 3. Scope of AI Assistance

### A. Web Front-End & IDE Prototyping
* **Generated:** UI layout scaffold simulating a full web-based IDE (VS Code / Web-based workbench), including CSS/Tailwind styling, sidebar panels, register inspector views, terminal emulation, theme switching logic, and execution controls (Step, Run, Reset).
* **Human Validation & Customization:** Adjusted datapath visualizer layouts, integrated custom microarchitectural controls, and tailored the interface specifically for the LIMO (RV32I Sesotho) instruction set requirements.

### B. Microarchitecture & Pipeline Modeling (M2 & M3 Specifications)
* **AI Assistance:** Writing helper functions to simulate state transitions across inter-stage pipeline registers:
  * `IF/ID` (65 bits)
  * `ID/EX` (171 bits)
  * `EX/MEM` (139 bits)
  * `MEM/WB` (136 bits)
* **Human Validation:** Ensured strict adherence to **Section 3(e) Zero-Flag Architecture** (direct conditionals `hlk` and `hft` comparing registers in the execution stage without status/NZCV flag registers) and deterministic 2-cycle branch penalty with IF/ID and ID/EX flushing.

### C. Milestone M3: 5-Stage Synchronous Core & Control Unit
* **AI Assistance:** Implementing the synchronous clock cycle stepping engine (`stepPipelineCycle`), dual-edge register write-back semantics (WB executed before ID to resolve WB/ID read-after-write hazards in the same cycle), hardwired `Control Unit` decoding Table 5 signals (`RegWrite`, `ALUSrc`, `ALUOp`, `MemRead`, `MemWrite`, `Branch`, `MemToReg`), and live interactive inspector updates (glowing stage visualizer pills, live WB register highlights, live memory store highlights, address jump navigation, and CPI calculation).
* **Human Validation:** Verified that hazard-free programs (arithmetic, logic, memory store/load, loop branches) execute with exact architectural results and match RV32I reference machines.

### D. Assembler Logic & Instruction Set Architecture (ISA)
* **AI Assistance:** Assisting in encoding string-to-binary/hex mapping for Sesotho mnemonics (Table 2.4) into standard RISC-V RV32I opcode formats (e.g., mapping `kop`, `khh`, `hlk`, `hft` to their respective binary fields).
* **Human Validation:** Verified register mappings ($r_0 = Letho$ zero register up to $r_{31}$) and instruction decoding boundaries against CS3520 project specifications.

### E. Automated Unit Testing & Benchmarking
* **AI Assistance:** Scaffolding the 29-test automated assembler unit test suite (M2) and 25-test pipeline core test suite (M3) across Node.js (`tests/pipeline.test.js`) and in-browser environments.
* **Human Validation:** Verified 100% pass criteria across all 54 tests and accuracy of architectural committed states.

---

## 4. Verification and Intellectual Integrity Statement

1. **Code Ownership & Understanding:** Every line of code generated or assisted by AI has been thoroughly reviewed, tested, and understood by the team members.
2. **Instructional Accuracy:** Theoretical concepts—including Harvard datapath separation, 5-stage synchronous clock cycles, hardwired control signals, zero-flag branch evaluation, and memory mapping—were designed to meet CS3520 course requirements.
3. **No Unattributed Logic:** AI was used as a productivity amplifier, not as a replacement for architectural design decisions.

---

*Submitted by Team **Visionary Architects***  
*Department of Computer Science, National University of Lesotho*
