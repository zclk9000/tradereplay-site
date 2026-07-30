import { readdirSync, statSync } from 'node:fs'
import { basename, extname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

const repoRoot = fileURLToPath(new URL('..', import.meta.url))
const git = spawnSync(
  'git',
  ['ls-files', '-z', '--cached', '--others', '--exclude-standard'],
  { cwd: repoRoot, encoding: 'utf8' },
)

if (git.status !== 0) {
  console.error(git.stderr || 'Unable to list repository files.')
  process.exit(1)
}

const repositoryFiles = git.stdout.split('\0').filter(Boolean)
const errors = []

const forbiddenPrefixes = [
  '.artifacts/',
  '.playwright-mcp/',
  '.private/',
  '.worktrees/',
  '.wrangler/',
  '_local/',
  'node_modules/',
]
const forbiddenNames = new Set(['.DS_Store'])
const forbiddenRootExtensions = new Set([
  '.gif',
  '.html',
  '.jpeg',
  '.jpg',
  '.mov',
  '.mp4',
  '.png',
  '.webp',
])
const maxRepositoryBytes = 15 * 1024 * 1024

for (const file of repositoryFiles) {
  if (forbiddenPrefixes.some((prefix) => file.startsWith(prefix))) {
    errors.push(`local-only path is tracked or unignored: ${file}`)
  }

  if (
    forbiddenNames.has(basename(file)) ||
    file.endsWith('.log') ||
    file.endsWith('.tmp')
  ) {
    errors.push(`temporary file is tracked or unignored: ${file}`)
  }

  if (!file.includes('/') && forbiddenRootExtensions.has(extname(file).toLowerCase())) {
    errors.push(`root-level media or page dump is tracked or unignored: ${file}`)
  }

  const size = statSync(join(repoRoot, file)).size
  if (size > maxRepositoryBytes) {
    errors.push(
      `file exceeds 15 MiB (${(size / 1024 / 1024).toFixed(1)} MiB): ${file}`,
    )
  }
}

const misplacedRootOutputs = readdirSync(repoRoot)
  .filter((name) => forbiddenRootExtensions.has(extname(name).toLowerCase()))
  .filter((name) => statSync(join(repoRoot, name)).isFile())

for (const name of misplacedRootOutputs) {
  errors.push(`move root-level local output to _local/ or .artifacts/: ${name}`)
}

if (errors.length > 0) {
  console.error('Repository hygiene check failed:')
  for (const error of errors) console.error(`- ${error}`)
  process.exit(1)
}

console.log(`Repository hygiene check passed (${repositoryFiles.length} files checked).`)
