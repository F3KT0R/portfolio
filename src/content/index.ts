// The content layer's public API. Pages and features read data through these
// functions, never by reaching into the data files, so the storage format can
// change (MDX, a CMS) without touching a component.

import { achievements } from './achievements'
import { character } from './character'
import { chronicle } from './chronicle'
import { quests } from './quests'
import type { Quest, QuestKind, Skill, SkillBranch } from './schema'
import { skillIds, skills, type SkillId } from './skills'
import { playstyle } from './playstyle'
import { testimonials } from './testimonials'

export { achievements, character, chronicle, playstyle, quests, skills, skillIds, testimonials }
export type { SkillId }
export type { QuestSlug } from './quests'
export {
  rarities,
  rarityMeaning,
  skillBranches,
  loadoutSlots,
  questKinds,
  type Achievement,
  type Attribute,
  type Character,
  type ChronicleEntry,
  type Condition,
  type Playstyle,
  type Quest,
  type QuestKind,
  type QuestStatus,
  type Rarity,
  type Shot,
  type Skill,
  type Testimonial,
  type SkillBranch,
} from './schema'

export type SkillWithId = Skill & { id: SkillId }

export function getSkill(id: string): SkillWithId | undefined {
  return id in skills ? { ...skills[id as SkillId], id: id as SkillId } : undefined
}

export function getSkillsByBranch(branch: SkillBranch): SkillWithId[] {
  return skillIds.filter((id) => skills[id].branch === branch).map((id) => ({ ...skills[id], id }))
}

export function getQuest(slug: string): Quest | undefined {
  return quests.find((q) => q.slug === slug)
}

export function getQuestsByKind(kind: QuestKind): Quest[] {
  return quests.filter((q) => q.kind === kind)
}

/** Quests that list the skill in their stack: the proof behind a skill. */
export function getQuestsUsingSkill(id: SkillId): Quest[] {
  return quests.filter((q) => q.stack.includes(id))
}

export function getFeaturedQuests(limit = 3): Quest[] {
  return getQuestsByKind('main').slice(0, limit)
}

/** What people said about one quest. */
export function getTestimonialsForQuest(slug: string) {
  return testimonials.filter((t) => t.quest === slug)
}
