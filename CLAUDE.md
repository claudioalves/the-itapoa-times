# CLAUDE.md - Antigravity Kit

> This file configures Claude Code for this workspace. Read `.agent/ARCHITECTURE.md` at session start.

---

## SYSTEM MAP

```
.agent/
├── ARCHITECTURE.md     # Kit overview — read first
├── agents/             # 20 specialist personas
├── skills/             # 36 domain knowledge modules
├── workflows/          # 11 slash commands (/create, /plan, /debug, etc.)
├── rules/GEMINI.md     # Global rule set (applies here too)
└── scripts/            # checklist.py, verify_all.py
```

---

## MANDATORY: AGENT & SKILL PROTOCOL

Before ANY code or design work, complete this checklist:

1. Identify the correct agent for the domain
2. Read `.agent/agents/{agent}.md`
3. Announce: `Applying knowledge of @[agent-name]...`
4. Load required skills from agent frontmatter (`skills:` field)

**Failure modes:**
- Writing code without identifying an agent = protocol violation
- Skipping skill loading = quality failure

---

## REQUEST CLASSIFIER

| Request Type     | Trigger Keywords                           | Action                              |
| ---------------- | ------------------------------------------ | ----------------------------------- |
| QUESTION         | "what is", "how does", "explain"           | Text response only                  |
| SURVEY/INTEL     | "analyze", "list files", "overview"        | Explore + summarize (no file write) |
| SIMPLE CODE      | "fix", "add", "change" (single file)       | Read agent + inline edit            |
| COMPLEX CODE     | "build", "create", "implement", "refactor" | Read agent + create `{task-slug}.md`|
| DESIGN/UI        | "design", "UI", "page", "dashboard"        | Read agent + create `{task-slug}.md`|

---

## AGENT ROUTING

Auto-select the best specialist based on request domain:

| Domain          | Agent                 | Key Skills                                    |
| --------------- | --------------------- | --------------------------------------------- |
| Web UI/UX       | `frontend-specialist` | react-best-practices, frontend-design         |
| API / Backend   | `backend-specialist`  | api-patterns, nodejs-best-practices           |
| Database        | `database-architect`  | database-design, prisma-expert                |
| Mobile          | `mobile-developer`    | mobile-design                                 |
| Security        | `security-auditor`    | vulnerability-scanner                         |
| Testing         | `test-engineer`       | testing-patterns, webapp-testing              |
| Debug           | `debugger`            | systematic-debugging                          |
| Planning        | `project-planner`     | brainstorming, plan-writing                   |
| Multi-domain    | `orchestrator`        | parallel-agents, behavioral-modes             |

> Mobile MUST use `mobile-developer`. Never `frontend-specialist` for mobile.

---

## UNIVERSAL RULES (Always Active)

### Language
- Respond in the user's language
- Code comments and variables stay in English

### Clean Code
All code follows `.agent/skills/clean-code/SKILL.md`. No exceptions.

### Socratic Gate
For complex/new feature requests, ask minimum 3 strategic questions before writing any code. Do NOT invoke agents or write code until the user clears the gate.

### File Dependency Awareness
Before modifying any file:
1. Check `CODEBASE.md` (if it exists) for dependencies
2. Update ALL affected files together

### Plan Mode (4-Phase)
1. ANALYSIS — research, questions
2. PLANNING — `{task-slug}.md`, task breakdown
3. SOLUTIONING — architecture, design (NO CODE)
4. IMPLEMENTATION — code + tests

---

## WORKFLOWS (Slash Commands)

| Command          | Description              |
| ---------------- | ------------------------ |
| `/brainstorm`    | Socratic discovery       |
| `/create`        | Create new features      |
| `/debug`         | Debug issues             |
| `/deploy`        | Deploy application       |
| `/enhance`       | Improve existing code    |
| `/orchestrate`   | Multi-agent coordination |
| `/plan`          | Task breakdown           |
| `/preview`       | Preview changes          |
| `/status`        | Check project status     |
| `/test`          | Run tests                |
| `/ui-ux-pro-max` | Design with 50 styles    |

Workflow files: `.agent/workflows/{command}.md`

---

## FINAL CHECKS

```bash
# Development — priority audit
python .agent/scripts/checklist.py .

# Pre-deploy — full suite
python .agent/scripts/verify_all.py . --url http://localhost:3000
```

Order: Security → Lint → Schema → Tests → UX → SEO → Lighthouse/E2E

A task is NOT finished until `checklist.py` returns success.

---

## DESIGN RULES

- Purple/violet colors are banned — see frontend-specialist.md
- No template/generic layouts
- Read the agent file for full design constraints before any UI work
