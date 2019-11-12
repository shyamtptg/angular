import { Client } from './Client';
import { JobDescriptionDetails  } from './JobDescriptionDetails';
export interface HiringRequestNeed{
    id:number,
    hiringRequestId:number,
    workLocation: Client,
    practice:string,
    competency:string,
    jobDescription:{
        id:number,
        details:JobDescriptionDetails
    }
    requiredExperienceInYears:number,
    expectedRole:string,
    resourcesCount:number,
    onsiteOffshoreModel:number

}
