import {writeFileSync, existsSync, readFileSync} from 'node:fs'

const OUT = new URL('../components/stats.json', import.meta.url)
const USER = 'erkamyaman'
const REPO = 'angular/angular'
const headers = {Accept: 'application/vnd.github+json', ...(process.env.GITHUB_TOKEN ? {Authorization: `Bearer ${process.env.GITHUB_TOKEN}`} : {})}

async function get(url) {
  const res = await fetch(url, {headers})
  if (!res.ok) throw new Error(`${res.status} ${url}`)
  return res.json()
}

try {
  const titles = []
  let total = 0
  for (let page = 1; page <= 10; page++) {
    const q = encodeURIComponent(`repo:${REPO} type:pr author:${USER} is:merged`)
    const data = await get(`https://api.github.com/search/issues?q=${q}&per_page=100&page=${page}`)
    total = data.total_count
    titles.push(...data.items.map((i) => i.title))
    if (titles.length >= total) break
  }
  const commitsData = await get(`https://api.github.com/search/commits?q=${encodeURIComponent(`repo:${REPO} author:${USER}`)}&per_page=1`)
  const n = (re) => titles.filter((t) => re.test(t)).length
  const stats = {
    prs: total,
    commits: commitsData.total_count,
    docs: n(/^(\[Backport[^\]]*\] )?docs/i),
    docsInfraFixes: n(/^fix\(docs-infra/i),
    examples: n(/example|snippet|demo|compile|sample|code block|tutorial/i),
    links: n(/link|anchor|404/i),
    angie: n(/angie/i),
    docsInfraFeatures: n(/^feat\(docs-infra/i),
    devtools: n(/\(devtools\)/i),
    compiler: n(/\((compiler|compiler-cli|language-server|vscode-extension|language-service)\)/i),
  }
  writeFileSync(OUT, JSON.stringify(stats, null, 2) + '\n')
  console.log('stats updated', stats)
} catch (e) {
  console.warn('stats not updated, keeping the last saved numbers:', e.message)
  if (!existsSync(OUT)) writeFileSync(OUT, readFileSync(new URL('./stats.fallback.json', import.meta.url)))
}
