import { Skill } from './Skill';
export interface SkillProficiency {
    skill: Skill,
    yearsOfExperience: number,
    rating: number,
    isNew?: boolean
}