# Contributing to the AWS Modular Workshop

Thank you for your interest in improving this workshop. This repo is designed to be forked, extended with new labs, and upstreamed back into the parent so the whole community benefits.

This guide explains how to propose a new lab, improve an existing lab, and submit changes in a way that’s easy to review and adopt.

## Ways to contribute

- Add a new lab (recommended)
- Improve an existing lab (content, code, diagrams, links)
- Fix bugs, typos, or broken links
- Improve navigation, consistency, or accessibility

## Repository layout recap

- `docs/` contains all workshop content, rendered by Docsify
  - Each lab lives in `docs/labs/lab_XXX_topic/` with:
    - `0_intro.md` (concepts/diagrams)
    - `1_hands_on.md` (steps/code/validation)
    - `2_resources.md` (useful links)
- `infra/` contains the CDK app that deploys the docs site (CloudFront/S3)

## Lab numbering, naming, and structure

- Numbering: use 20-point gaps to allow insertions. Example: `100, 120, 140, ...`
- Folder name: `lab_XXX_snake_case_topic`, e.g. `lab_580_kinesis_streams`
- Required files per lab:
  - `0_intro.md` (objectives, diagrams, core concepts, prerequisites)
  - `1_hands_on.md` (step-by-step with code and validation/troubleshooting)
  - `2_resources.md` (high‑signal, accurate references; avoid generic home pages)
- Update navigation:
  - Add your lab to `docs/_sidebar.md` with `.md` suffixes
  - If needed, add a brief mention in `README.md` under the series table

## Content conventions

- Tone: professional, concise, action‑oriented; avoid internal notes or placeholders
- Diagrams: prefer Mermaid in the markdown; if using external diagrams, add SVGs under `docs/media/` and reference them
- Security: call out where demos use broad CIDRs or defaults; include “harden for production” notes
- Cleanup: every lab must include teardown steps to avoid residual cost
- Validation: include quick checks users can run to confirm success

## Code conventions (snippets in labs)

- CDK v2 (`aws-cdk-lib`, `constructs` v10+) and TypeScript for examples
- Lambda runtime: `nodejs22.x` (`lambda.Runtime.NODEJS_22_X`) unless the lab requires a different runtime
- AWS SDK v3 clients in Node.js examples
- Prefer modern constructs and APIs (e.g., `S3Origin` for CloudFront, event sources for Lambda)
- Keep examples minimal but production‑informed (logging, error handling, metrics)

## Link and reference policy

- Prefer official AWS docs; link to stable product pages rather than deep ephemeral anchors when possible
- Avoid tag pages, “search” result links, and outdated blog posts
- Use HTTPS and avoid bare IP/`http://` external links
- Ensure link text accurately describes the destination

## Local validation checklist

Before opening a PR:

- Content
  - [ ] Each lab has `0_intro.md`, `1_hands_on.md`, `2_resources.md`
  - [ ] All diagrams present (no placeholder comments remaining)
  - [ ] Includes validation steps and cleanup
- Links
  - [ ] Run link check for your lab(s):
    ```bash
    npx -y markdown-link-check -q docs/labs/lab_XXX_topic/0_intro.md
    npx -y markdown-link-check -q docs/labs/lab_XXX_topic/1_hands_on.md
    npx -y markdown-link-check -q docs/labs/lab_XXX_topic/2_resources.md
    ```
- Code examples
  - [ ] CDK snippets compile conceptually (imports/APIs match CDK v2)
  - [ ] Node examples use AWS SDK v3
- Site build (optional but encouraged)
  - [ ] `cd infra && npm ci && npm run build` completes

## Submitting changes

1. Fork the repo to your GitHub account
2. Create a feature branch from `main` (or the active development branch)
   - Branch name: `lab-XXX-topic` or `improvement-area`
3. Commit logically, with clear messages (conventional style appreciated):
   - `feat(lab-580): add Kinesis Streams lab`
   - `fix(lab-260): correct service discovery API and resources links`
4. Push your branch and open a Pull Request to the parent repo
5. Fill out the PR checklist (below) and describe the changes succinctly with screenshots if helpful

## PR review checklist (what maintainers look for)

- Alignment with lab structure and tone
- Accurate, current AWS service usage (APIs, runtimes, best practices)
- High‑signal resources that match descriptions
- Clear validation and cleanup steps
- Navigation updated and consistent
- No broken links or placeholder diagrams

## Governance and decisions

- Small fixes (typos/broken links) are usually fast‑tracked
- New labs and large edits may require iterative review for consistency and safety
- Maintainers may adjust numbering, titles, or navigation for coherence

## “Make it your own” (for forkers)

- You can rebrand, reorder, or swap labs in your fork to suit your audience
- When upstreaming, keep common patterns intact so your work integrates cleanly
- If your lab is highly specialized, consider adding it under an advanced series (e.g., `580+`) to preserve flexibility

## Licensing and attribution

- By contributing, you agree your contributions are provided under the repository’s license
- Add author credit in the lab intro if desired (brief line at the end)

## Support

- Open an Issue for discussions, proposals, or questions
- Use clear titles: `Proposal: New LAB-5XX <topic>` or `Fix: LAB-XXX <summary>`

---

Thank you for helping build a high‑quality, modular AWS workshop others can remix and extend.
