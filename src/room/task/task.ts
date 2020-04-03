export interface Task {
    canExecute(room: Room): boolean;
    execute(room: Room): ScreepsReturnCode;
}
