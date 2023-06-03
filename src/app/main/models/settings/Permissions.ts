import {hostHeaderInfo} from '../hostHeaderInfo';

export class Permissions {
    hostHeaderInfo: hostHeaderInfo;
    id: number;
    isAdmin: boolean;
    IsAllowedToCreateEditUser: boolean;
    IsAllowedToCreateEditTag: boolean;
    IsAllowedToCreateEditRoles: boolean;
    IsAllowedToViewUser: boolean;
    IsAllowedToChangeStep: boolean;
    IsAllowedToAssignTasks: boolean;
    roleID: number;
}
