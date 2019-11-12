import { Skill } from './Skill';
export interface SkillProficiency {
    skill: Skill,
    experience: number,
    proficiency: number,
    isNew?: boolean
}