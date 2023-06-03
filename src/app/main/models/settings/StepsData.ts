import {hostHeaderInfo} from '../hostHeaderInfo';

export class StepsData {
    hostHeaderInfo: hostHeaderInfo;
    id: number;
    stepID: number;
    allowedDaysInStep: number;
    isPartOfADR: boolean;
    isPartOfTTL: boolean;
    createdByUserID: number;
    companyID: number;
    isActiveFlag: boolean;
    ADRGoal: number;
    TTLGoal: number;
    completedVehicleByWeekGoal: number;
}
