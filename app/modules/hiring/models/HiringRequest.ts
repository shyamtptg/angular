import { Client } from './Client';
import { BasicEmployee } from '../../../shared/models/BasicEmployee';
import { HiringReason } from './HiringReason';
import { HiringPriority } from './HiringPriority';
import { HiringType } from './HiringType';
import { HiringRequestStatus } from './HiringRequestStatus';
import { InterviewLevel } from './InterviewLevels';
import { HiringRequestNeed } from './HiringRequestNeed';
export interface HiringRequest {
    id: number;
    client: Client,
    department: string,
    hiringManager: BasicEmployee,
    staffingExecutive: BasicEmployee,
    hiringReason: HiringReason,
    hiringType: {
        id: number,
        name: HiringType
    },
    hiringPriority: {
        id: number,
        priority: HiringPriority
    },
    hiringStatus: {
        id: number,
        status: HiringRequestStatus
    },
    interviewPanelMembers: Array<{ panelMember: BasicEmployee, interviewLevel: InterviewLevel }>,
    needs: Array<HiringRequestNeed>,
    skillType: string,
    expectedStartDate: number,
    startDate: number,
    closeDate: number,
    comments: string,
    processedProfilesCount: number,
    releasedOffersCount: number,
    joinedResourcesCount: number
}