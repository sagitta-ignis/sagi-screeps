import { BaseRoleManager } from "./manager.base";
import { Roles } from "creep/roles.enum";
import { creepMemory } from "creep/memory";
import { roomMemory } from "room/memory";
import { freeSpaceAround } from "utils/terrain";

export abstract class Worker<WorkTarget extends { pos: RoomPosition }> extends BaseRoleManager {

    protected moveToHarvestOpts: MoveToOpts;
    protected moveToWorkOpts: MoveToOpts;

    constructor(role: Roles) {
        super(role);
        this.moveToHarvestOpts = {
            visualizePathStyle: { stroke: '#ffffff' }
        };
        this.moveToWorkOpts = {
            visualizePathStyle: { stroke: '#ffaa00' }
        };
    }

    run(creep: Creep): ScreepsReturnCode {
        let code: ScreepsReturnCode = undefined as any;
        const memory = creepMemory(creep);
        if (memory.working && creep.store.getUsedCapacity() === 0) {
            memory.working = false;
            this.sayHarvest(creep);
        }
        if (!memory.working && creep.store.getFreeCapacity() === 0) {
            memory.working = true;
            this.sayWork(creep);
        }

        if (memory.working) {
            this.forgetHarvestTarget(creep);
            const target = this.findWorkTarget(creep);
            if (target) {
                code = this.workOnTarget(creep, target);
            } else {
                console.log(`[${creep.name}]: no target for [${this.role}] found`);
            }
        } else {
            const source = this.findHarvestTarget(creep);
            if (source) {
                this.memorizeHarvestTarget(creep, source);
                code = this.harvestTarget(creep, source);
            } else {
                console.log(`[${creep.name}]: no target for harvest found`);
            }
            if (code == ERR_NO_PATH) {
                this.forgetHarvestTarget(creep);
                code = OK;
            }
        }
        if (code == ERR_BUSY || code == ERR_TIRED) {
            code = OK;
        }
        return code;
    }

    protected sayHarvest(creep: Creep): void {
        creep.say('🔄 harvest');
    }

    protected abstract sayWork(creep: Creep): void;

    protected findHarvestTarget(creep: Creep): Source | null {
        let source: Source | null = null;
        const memory = creepMemory(creep);
        if (!memory.target) {
            source = this.findClosestSourceByRange(creep);
        }
        if (!source && memory.target) {
            source = creep.room.lookForAt('source', memory.target.x, memory.target.y)[0];
        }
        return source;
    }

    protected findClosestSourceByRange(creep: Creep) {
        const roomMem = roomMemory(creep.room);
        const reservedSources = roomMem.reservedSources;
        return creep.pos.findClosestByRange(FIND_SOURCES, {
            filter: source => (reservedSources[source.id] || 0) < freeSpaceAround(creep.room, source.pos).length
        });
    }

    protected memorizeHarvestTarget(creep: Creep, source: Source) {
        const pos = source.pos;
        const memory = creepMemory(creep);
        if (!memory.target) {
            const roomMem = roomMemory(creep.room);
            roomMem.reservedSources[source.id] += 1;

            memory.target = {
                x: pos.x,
                y: pos.y
            };
        }
    }

    protected forgetHarvestTarget(creep: Creep): void {
        const memory = creepMemory(creep);
        if (memory.target) {
            const source = creep.room.lookForAt('source', memory.target.x, memory.target.y)[0];
            if (source) {
                roomMemory(creep.room).reservedSources[source.id] -= 1;
            }
            delete memory.target;
        }
    }

    unassign(creep: Creep) {
        this.forgetHarvestTarget(creep);
        super.unassign(creep);
    }

    protected harvestTarget(creep: Creep, target: Source): ScreepsReturnCode {
        return this.interactOrMoveToTarget(
            creep, target,
            () => creep.harvest(target),
            (code) => console.log(`[${creep.name}]: harvest failed with [${code}]`),
            this.moveToHarvestOpts
        );
    }

    protected abstract findWorkTarget(creep: Creep): WorkTarget | null;

    protected workOnTarget(creep: Creep, target: WorkTarget): ScreepsReturnCode {
        return this.interactOrMoveToTarget(
            creep, target,
            () => this.work(creep, target),
            (code) => this.failedToWork(creep, code),
            this.moveToWorkOpts
        );
    }

    protected interactOrMoveToTarget(
        creep: Creep, target: { pos: RoomPosition },
        interact: () => ScreepsReturnCode,
        fail: (code: ScreepsReturnCode) => void,
        moveOpts?: MoveToOpts
    ): ScreepsReturnCode {
        let code: ScreepsReturnCode = interact();
        if (code == ERR_NOT_IN_RANGE) {
            code = creep.moveTo(target, moveOpts);
        }
        if (code != OK && code != ERR_TIRED) {
            fail(code);
        }
        return code;
    }

    protected abstract work(creep: Creep, target: WorkTarget): ScreepsReturnCode;
    protected abstract failedToWork(creep: Creep, code: ScreepsReturnCode): void;
}
