import {
  chronicle,
  getSkill,
  getSkillsByBranch,
  quests,
  skillBranches,
  skillBranchLabels,
  type ChronicleEntry,
  type Quest,
} from '@/content'

// What the CV shows, decided in one place so the layout stays dumb.

/** Current roles keep more detail; past roles are summarised. */
const HIGHLIGHTS_CURRENT = 4
const HIGHLIGHTS_PAST = 2

export function cvExperience(): (ChronicleEntry & { shown: string[] })[] {
  return chronicle
    .filter((entry) => entry.kind !== 'education')
    .map((entry) => ({
      ...entry,
      shown: entry.highlights.slice(0, entry.end ? HIGHLIGHTS_PAST : HIGHLIGHTS_CURRENT),
    }))
}

export function cvEducation() {
  return chronicle.filter((entry) => entry.kind === 'education')
}

/** Projects not already told under Experience, so nothing appears twice. */
export function cvProjects(limit = 4): Quest[] {
  const told = new Set(chronicle.flatMap((entry) => entry.quests))
  return quests.filter((q) => q.kind !== 'archive' && !told.has(q.slug)).slice(0, limit)
}

/** Skills worth listing on paper: proficient and above, grouped by branch. */
export function cvSkills() {
  return skillBranches.map((branch) => ({
    branch,
    label: skillBranchLabels[branch],
    names: getSkillsByBranch(branch)
      .filter((s) => s.rarity !== 'common' && s.rarity !== 'uncommon')
      .map((s) => s.name),
  }))
}

/** A project's technology, for the stack line: no soft skills, at most six. */
export function cvStack(quest: Quest) {
  return quest.stack
    .flatMap((id) => getSkill(id) ?? [])
    .filter((skill) => skill.branch !== 'craft')
    .slice(0, 6)
}
