---
id: 1
title: update-phase-iv-kubernetes-constitution
stage: constitution
date: 2026-01-29
surface: agent
model: Claude Sonnet 4.5
feature: none
branch: phase-3-chatkit-clean
user: user
command: /sp.constitution
labels: [constitution, kubernetes, deployment, ai-devops]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - .specify/memory/constitution.md
tests:
---

## Prompt

```text
/sp.constitution

Project: Phase IV – Local Kubernetes Deployment of Cloud-Native Todo Chatbot

Objective:
Deploy the Phase III Todo Chatbot (frontend + backend) on a local Kubernetes cluster using Minikube and Helm Charts, fully operated through AI-assisted DevOps tools.

Development Philosophy:
This project strictly follows the Agentic Dev Stack and Spec-Driven Development methodology. Infrastructure automation, containerization, and orchestration must be governed by specifications, plans, and task breakdowns before implementation.

Core Principles:
- Spec-First Execution: No action may be taken before a clear specification is defined
- AI-Governed Operations: All Docker and Kubernetes actions must be AI-assisted
- Local-First Cloud-Native Design: Deployment must run on local Minikube only
- Reproducibility: Every step must be repeatable on a fresh local machine
- Explainability: Each infrastructure decision must be justified before execution
- Zero Manual Coding: No handwritten Dockerfiles, YAML, or scripts

Mandatory Workflow:
1. Analyze the Phase IV specification
2. Generate a structured deployment plan
3. Break the plan into atomic infrastructure tasks
4. Execute tasks using AI-assisted CLI tools only
5. Validate outcomes after each phase

Tooling Constraints (Strict):
- Containerization:
  - Primary: Docker AI Agent (Gordon)
  - Fallback: Standard Docker CLI only if Gordon is unavailable
- Kubernetes Cluster:
  - Minikube (local only)
- Packaging:
  - Helm Charts (no raw YAML outside Helm)
- AI DevOps:
  - kubectl-ai for deployment, scaling, debugging
  - kagent for cluster health analysis and optimization
- Application Source:
  - Phase III Todo Chatbot only

Operational Rules:
- Prefer natural language CLI commands over imperative instructions
- Use kubectl-ai before kagent unless advanced analysis is required
- Helm charts must be generated or scaffolded via AI tooling
- Docker images must be created through Gordon-assisted workflows
- All deployments must target the Minikube cluster context
- Do not assume cloud providers or managed Kubernetes services
- Containerization must be executed by ContainerAgent using Docker AI (Gordon)
- Kubernetes deployment and Helm chart management must be executed by KubernetesAgent
- Cluster health, optimization, and troubleshooting must be executed by AIOpsAgent
- Spec → Plan → Tasks flow must be managed by SpecOrchestratorAgent
- No manual execution is allowed outside of these agents


Prohibited Actions:
- Writing manual Dockerfiles or Kubernetes YAML by hand
- Deploying directly with kubectl apply without Helm
- Using cloud Kubernetes services (EKS, GKE, AKS)
- Skipping the spec → plan → tasks pipeline
- Performing infrastructure changes without AI assistance

Success Criteria:
- Frontend and backend are containerized and runnable
- Helm charts successfully deploy both services on Minikube
- kubectl-ai is used for deployment, scaling, and debugging
- kagent is used for at least one cluster-level analysis
- All pods reach a healthy running state
- The full work
```

## Response snapshot

Updated the project constitution to version 1.2.0 to include Phase IV Kubernetes deployment requirements. Added new principles for Kubernetes-First Deployment, AI-Assisted DevOps Operations, and Container-First Architecture. Modified existing principles to incorporate AI-assisted tools, ContainerAgent, KubernetesAgent, and AIOpsAgent requirements. Updated the governance section to reflect the new operational rules for Phase IV.

## Outcome

- ✅ Impact: Updated constitution to include Kubernetes deployment requirements for Phase IV
- 🧪 Tests: N/A
- 📁 Files: Updated .specify/memory/constitution.md with new version and requirements
- 🔁 Next prompts: /sp.specify to create the Phase IV specification
- 🧠 Reflection: Successfully integrated Phase IV requirements into the constitution while maintaining backward compatibility

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Begin Phase IV specification creation