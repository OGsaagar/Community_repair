# GitHub Secrets Configuration for RepairHub

This guide documents the secrets required for Phase 7 CI/CD workflows to function properly.

## Required Secrets

### 1. Vercel Deployment Secrets

These are needed by the **Deploy workflow** (`.github/workflows/deploy.yml`) to deploy to Vercel.

**VERCEL_TOKEN**
- Generation: Go to vercel.com → Settings → Tokens → Create
- Description: One Personal Access Token for deployment
- Scope: Full account access
- Store in: GitHub Repo Settings → Secrets → New Repository Secret

**VERCEL_ORG_ID**
- Find at: vercel.com → Settings → General → "Team/Organization ID"
- Example: `team_1234567890abcdef`
- Store in: GitHub Repo Settings → Secrets → New Repository Secret

**VERCEL_PROJECT_ID**
- Find at: Your Vercel project page → Settings → General → "Project ID"
- Example: `prj_abcdef1234567890`
- Store in: GitHub Repo Settings → Secrets → New Repository Secret

### 2. Supabase Migration Secrets

These are needed by the **DB Migrations workflow** (`.github/workflows/db-migrations.yml`) to push schema changes to production.

**SUPABASE_ACCESS_TOKEN**
- Generation: Go to supabase.com → Organization → Settings → Access Tokens → Create new token
- Name it: `github-ci-migrations`
- Scope: Can be limited to your specific project
- Store in: GitHub Repo Settings → Secrets → New Repository Secret

**SUPABASE_PROJECT_ID**
- Find at: Supabase Dashboard → Project Settings → General → "Project ID"
- Example: `abcdefghijklmnop`
- Store in: GitHub Repo Settings → Secrets → New Repository Secret

**SUPABASE_DB_PASSWORD**
- ⚠️ **WARNING**: This is your database password
- Find at: Supabase Dashboard → Project Settings → Database → Connection Pooling (if setup) or the original password
- **NEVER** add this to any public repository
- **NEVER** commit this to git
- Store ONLY in: GitHub Repo Settings → Secrets → New Repository Secret
- Alternative: Use restricted service role key instead (recommended for future)

## How to Add Secrets to GitHub

1. Go to: GitHub.com → Your Repository → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Enter the secret name (exactly as listed above)
4. Enter the value (no extra spaces or quotes)
5. Click "Add secret"

## Workflow Usage

### CI Workflow (Always Runs)
- **Trigger**: Pull request to `main` or `develop` branches
- **Secrets needed**: None (doesn't use Vercel or Supabase)
- **Jobs**:
  - `lint-and-typecheck`: Runs ESLint and TypeScript type checking
  - `test`: Runs Jest test suite

### Deploy Workflow (Requires Vercel Secrets)
- **Trigger**: Push to `main` branch
- **Secrets needed**: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`
- **Job**: Deploy to Vercel production environment with `--prod` flag
- **Automatic**: Runs after CI passes (when PR is merged to main)

### DB Migrations Workflow (Requires Supabase Secrets)
- **Trigger**: Push to `main` branch WITH changes to `supabase/migrations/**` files
- **Secrets needed**: `SUPABASE_ACCESS_TOKEN`, `SUPABASE_PROJECT_ID`, `SUPABASE_DB_PASSWORD`
- **Job**: Applies pending migrations to production database
- **Safety**: Only runs if migration files are modified (won't auto-run on other changes)

## Security Best Practices

✅ **DO**:
- Rotate tokens every 6 months
- Use minimal scopes (don't give full account access if not needed)
- Audit workflow logs for failed deployments
- Keep secrets out of `.env.local` files checked into git
- Use branch protection rules requiring CI to pass before merge

❌ **DON'T**:
- Use personal credentials in workflows
- Hardcode secrets in workflow files
- Commit `.env.local` to git
- Share secrets via email or chat
- Use the same token for multiple services

## Testing Workflows Locally

You can test workflows locally using `act`:

```bash
# Install act: https://github.com/nektos/act

# Run the CI workflow
act pull_request

# Run the deploy workflow
act push -j deploy

# Run with secrets from local .env
act -s VERCEL_TOKEN=your_token_here
```

## Troubleshooting

### Deploy workflow fails with "Invalid token"
- Double-check `VERCEL_TOKEN` is correct and hasn't expired
- Verify token was created with appropriate scopes
- Test: `curl -H "Authorization: Bearer $TOKEN" https://api.vercel.com/v2/user`

### DB Migrations workflow doesn't trigger
- Check that branch is `main`
- Verify migration files are in `supabase/migrations/**`
- Check file paths in workflow are correct

### CI workflow fails only on PR, not locally
- Different Node version between local and GitHub runner
- Missing npm packages: run `npm ci` (not `npm install`)
- TypeScript cache issue: run `npm run clean` before building

## Verifying Setup

After all secrets are configured, test by:

1. **Test CI**: Create a PR with a lint issue and verify CI catches it
2. **Test Deploy**: Push to main and check Vercel deployment link
3. **Test Migrations**: Create a test migration file and push to main

## Next Steps

Once secrets are configured:
1. Enable branch protection on `main` requiring CI to pass
2. Configure status checks in GitHub (require both lint-and-typecheck and test)
3. Add deployment reviews for safety (optional but recommended)
4. Monitor workflow runs in GitHub Actions tab

## Related Files

- `.github/workflows/ci.yml` - CI workflow definition
- `.github/workflows/deploy.yml` - Deploy workflow definition
- `.github/workflows/db-migrations.yml` - DB migration workflow definition
- `.github/pull_request_template.md` - PR template with checks

---

**Last Updated**: April 2026  
**Phase**: Phase 7 — CI/CD Integration
