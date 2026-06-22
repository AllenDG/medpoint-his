## What Changed

<!-- Describe what this PR changes. Be specific — reference files, components, or API routes affected. -->


## Why

<!-- Explain the reason. Link to an issue if applicable. -->
<!-- Closes #<issue-number> -->


## Affected Area / Role

<!-- Check all that apply -->
- [ ] Public Site (`client/src/features/public-site/`)
- [ ] Help Desk Portal (`client/src/features/helpdesk/`)
- [ ] Nurse Portal (`client/src/features/nurse/`)
- [ ] Auth (`client/src/features/auth/` · `server/src/infrastructure/auth/`)
- [ ] UI Components (`client/src/components/`)
- [ ] API / Backend (`server/src/`)
- [ ] Shared / Config (`package.json` · `tsconfig` · `prisma/schema.prisma`)
- [ ] CI / Workflows (`.github/workflows/`)


## How It Was Tested

<!-- Describe manual testing steps or automated tests added/updated. -->
- [ ] Unit tests pass (`npm run test`)
- [ ] E2E tests pass (`npm run test:e2e`)
- [ ] Tested manually in browser — describe steps:


## Sensitive Path Review

> If any of the boxes below apply, **2 approvals are required** before merging.

- [ ] Changes to `server/src/infrastructure/auth/`
- [ ] Changes to `auth.middleware.ts` or `role.middleware.ts`
- [ ] Changes to `server/src/domain/rules/`
- [ ] Changes to `client/src/features/auth/` or `ProtectedRoute.tsx`
- [ ] Changes to `server/prisma/schema.prisma`
- [ ] Changes to `.github/workflows/`
- [ ] None of the above — 1 approval sufficient


## Pre-Merge Checklist

- [ ] Branch name follows GitFlow convention (`feature|bugfix|hotfix|release/<scope>-<desc>`)
- [ ] All commit messages follow Conventional Commits (`type(scope): description`)
- [ ] PR targets the correct base branch (`feature/bugfix → develop`, `release/hotfix → main`)
- [ ] No direct commits to `main` or `develop`
- [ ] CI checks passing (`gitflow-validation` workflow green)
- [ ] No `.env` or secrets included in diff
- [ ] If `release/*` or `hotfix/*`: back-merge to `develop` scheduled after merge to `main`
