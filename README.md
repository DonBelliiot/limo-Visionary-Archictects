# limo-Visionary-Architects

## 📌 1. Project Overview (M1 Focus)

**LIMO** is a 32-bit load-store processor derived from **RISC-V (RV32I)**, featuring an assembly language written in **Sesotho** using Lesotho orthography.

For **Milestone 1 (M1)**, our focus is strictly on establishing the core architecture foundation:
* **ISA Specification (A1–A5):** Defining fixed 32-bit instruction formats ($R$, $I$, $S$, $B$), register file mappings with Sesotho names (e.g., `$Ha ho letho` for zero), and assembly mnemonics.
* **Design-Decision Log (A6):** Documenting trade-off analyses on register count, microarchitectural registers, branch resolution stages, and load-use stalls.
* **Initial Programs:** Hand-encoding three benchmark Sesotho assembly programs into binary and hexadecimal formats.
* **Repository Setup:** Configuring protected branches, team roles, and issue tracking boards.

---

## 👥 2. Team Members

The project is designed and developed by a group of seven collaborators assigned for CS3520:

| Member | GitHub Username | Student Numbers | Role Context |
| :--- | :--- | :--- | :--- |
| **Morapeli Seboka** | `@Dahraps` | 202401651 | Student Collaborator |
| **Beleme Lenkoe** | `@DonBelliiot` | 202322644 | Student Collaborator |
| **Kopano Komanyane** | `@GregoryHorsley` | 202321320 | Student Collaborator |
| **Khobatha Setetemela** | `@khobatha` | - | Course Coordinator & Project Advisor |
| **Liposo Ranoka** | `@Liposo-Ranoka` | 202400088 | Student Collaborator |
| **Matseliso Kheola** | `@Matseliso20` | 202202304 | Student Collaborator |
| **Tumo Tsehla** | `@tsehlatumo-ops` | 202400550 | Student Collaborator |
| **Thaane Moletsane** | `@THMN123` | 202322687 | Student Collaborator |

## 3. Team Roles & Weekly Rotation Schedule

### Multi-Week Rotation 

| Week & Dates | Milestone Goal | Role Assignments |
| :---: | :--- | :--- |
| **Wk 7**<br>(28 Sep – 04 Oct) | **M1:** ISA Spec & Sample Programs | **ISA Lead:** Dahraps <br> **Assembler Lead:** DonBelliiot <br> **Pipeline Lead:** GregoryHorsley <br> **Hazard Lead:** Liposo-Ranoka <br> **Interface Lead:** Matseliso20 <br> **Test Lead:** tsehlatumo-ops <br> **Scrum Lead:** Thaane Moletsane |
| **Wk 8**<br>(05 Oct – 11 Oct) | **M2:** Simulator Design & Assembler | **ISA Lead:** DonBelliiot <br> **Assembler Lead:** GregoryHorsley <br> **Pipeline Lead:** Liposo-Ranoka <br> **Hazard Lead:** Matseliso20 <br> **Interface Lead:** tsehlatumo-ops <br> **Test Lead:** Thaane Moletsane <br> **Scrum Lead:** Dahraps |
| **Wk 9**<br>(12 Oct – 18 Oct) | **M3:** 5-Stage Core Pipeline | **ISA Lead:** GregoryHorsley <br> **Assembler Lead:** Liposo-Ranoka <br> **Pipeline Lead:** Matseliso20 <br> **Hazard Lead:** tsehlatumo-ops <br> **Interface Lead:** Thaane Moletsane <br> **Test Lead:** Dahraps <br> **Scrum Lead:** DonBelliiot |
| **Wk 10**<br>(19 Oct – 25 Oct) | **M4:** Hazards & Live Visuals | **ISA Lead:** Liposo-Ranoka <br> **Assembler Lead:** Matseliso20 <br> **Pipeline Lead:** tsehlatumo-ops <br> **Hazard Lead:** Thaane Moletsane <br> **Interface Lead:** Dahraps <br> **Test Lead:** DonBelliiot <br> **Scrum Lead:** GregoryHorsley |
| **Wk 11**<br>(26 Oct – 01 Nov) | **M5:** Final Release v1.0 & Report | **ISA Lead:** Matseliso20 <br> **Assembler Lead:** tsehlatumo-ops <br> **Pipeline Lead:** Thaane Moletsane <br> **Hazard Lead:** Dahraps <br> **Interface Lead:** DonBelliiot <br> **Test Lead:** GregoryHorsley <br> **Scrum Lead:** Liposo-Ranoka |

---

## 📁 4. Repository Structure

```text
limo-group-project/
├── .github/              
├── docs/               
├── examples/           
├── src/                  
├── tests/               
├── AI_USE.md            
└── README.md             
```