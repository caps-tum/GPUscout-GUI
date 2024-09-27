import { Analysis, Occurrence } from '../Analysis';

export const WARP_DIVERGENCE_METRICS = {
    BRANCH_DIVERGENCE_PERCENT: 'branch_divergence_percent'
};

export class WarpDivergenceAnalysis extends Analysis {
    constructor(analysisData, kernel) {
        super(
            analysisData,
            kernel,
            WARP_DIVERGENCE_METRICS,
            (occurrenceData) => new WarpDivergenceOccurrence(occurrenceData)
        );
    }
}

export class WarpDivergenceOccurrence extends Occurrence {
    constructor(occurrenceData) {
        super(occurrenceData);

        /** @type {String} */
        this.targetBranch = occurrenceData['target_branch'];
        /** @type {String} */
        this.targetBranchStartBinaryLineNumber = occurrenceData['target_branch_start_line_number'];
    }
}
