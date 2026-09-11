import { Reveal } from '../../components/common/Reveal'

const CORE_ORDER = ['Laravel', 'PHP', 'React', 'MySQL', 'Docker', 'Git']

const CATEGORY_ORDER = [
  'FRONTEND',
  'BACKEND',
  'DATABASE',
  'DEVELOPMENT TOOLS',
  'UI / UX',
  'OTHER',
]

const CATEGORY_RULES = [
  { cat: 'FRONTEND', match: ['react', 'javascript', 'typescript', 'html', 'css', 'tailwind'] },
  { cat: 'BACKEND', match: ['php', 'laravel', 'rest'] },
  { cat: 'DATABASE', match: ['mysql', 'database design'] },
  { cat: 'DEVELOPMENT TOOLS', match: ['git', 'docker', 'postman', 'vs code'] },
  { cat: 'UI / UX', match: ['figma', 'multimedia'] },
]

function norm(name) {
  return String(name)
    .toLowerCase()
    .replace(/\(.*\)/, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function looksLike(name, key) {
  const n = norm(name)
  return key.split(' ').some((part) => n.includes(part))
}

function pickCore(skills) {
  const list = []
  for (const label of CORE_ORDER) {
    const found = skills.find((s) => looksLike(s.name, label))
    if (found) list.push(found.name)
  }
  return list
}

function groupByCategory(skills) {
  const buckets = Object.fromEntries(CATEGORY_ORDER.map((c) => [c, []]))
  for (const skill of skills) {
    const rule = CATEGORY_RULES.find((r) => r.match.some((m) => looksLike(skill.name, m)))
    buckets[rule ? rule.cat : 'OTHER'].push(skill)
  }
  return buckets
}

function CoreBlock({ core }) {
  return (
    <div className="mx-auto mt-12 max-w-3xl border border-navy-700 bg-navy-900 px-6 py-8 sm:px-10">
      <p className="text-center text-xs font-semibold uppercase tracking-[0.3em] text-blue-600">
        Core Skills
      </p>
      <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-center">
        {core.map((name) => (
          <li key={name}>
            <span className="text-lg font-medium text-slate-900 sm:text-xl">{name}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function CategoryCard({ title, items }) {
  if (!items.length) return null
  return (
    <div className="border border-navy-700 bg-navy-900 p-6 sm:p-7">
      <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-900">
        {title}
      </h3>
      <div className="mt-3 h-px w-8 bg-blue-600" />
      <ul className="mt-4 divide-y divide-navy-700/60">
        {items.map((skill) => (
          <li key={skill.id}>
            <span className="flex min-h-[44px] items-center text-base text-slate-700 transition-colors duration-200 hover:text-blue-600">
              {skill.name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function SkillMatrix({ skills }) {
  const core = pickCore(skills)
  const buckets = groupByCategory(skills)

  return (
    <div>
      {core.length > 0 && (
        <Reveal>
          <CoreBlock core={core} />
        </Reveal>
      )}

      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
        {CATEGORY_ORDER.map((cat, i) =>
          buckets[cat].length > 0 ? (
            <Reveal key={cat} delay={i * 60}>
              <CategoryCard title={cat} items={buckets[cat]} />
            </Reveal>
          ) : null,
        )}
      </div>
    </div>
  )
}