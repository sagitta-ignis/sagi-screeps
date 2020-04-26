import { Worker } from "./worker";
import { Roles } from "../roles.enum";

export class Builder extends Worker<ConstructionSite> {

    constructor() {
        super(Roles.Builder);
    }

    protected sayWork(creep: Creep): void {
        creep.say('🚧 build');
    }

    protected findWorkTarget(creep: Creep): ConstructionSite | null {
        const targets = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
        if (targets.length) {
            return targets[0];
        }
        return null;
    }

    protected work(creep: Creep, target: ConstructionSite): ScreepsReturnCode {
        return creep.build(target);
    }

    protected failedToWork(creep: Creep, code: ScreepsReturnCode): void {
        console.log(`[${creep.name}]: build failed with [${code}]`);
    }
}
