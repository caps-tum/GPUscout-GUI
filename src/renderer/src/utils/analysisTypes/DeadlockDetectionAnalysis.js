import { Analysis } from '../Analysis';

export class DeadlockDetectionAnalysis extends Analysis {
    constructor(analysisData, kernel) {
        super(analysisData, kernel);

        /** @type {Boolean} */
        this.hasDeadlock = analysisData['deadlock'];
    }
}
