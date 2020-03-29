export interface Task {
    execute(room: Room): ScreepsReturnCode;
}
