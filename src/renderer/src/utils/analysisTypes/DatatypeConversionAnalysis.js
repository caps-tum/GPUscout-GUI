import { Analysis, Occurrence } from '../Analysis';

export const DATATYPE_CONVERSION_METRICS = {
    WARP_STALLS_TEX_THROTTLE_PERCENT: 'smsp__warp_issue_stalled_tex_throttle_per_warp_active',
    WARP_STALLS_MIO_THROTTLE_PERCENT: 'smsp__warp_issue_stalled_mio_throttle_per_warp_active',
    WARP_STALLS_SHORT_SCOREBOARD_PERCENT: 'smsp__warp_issue_stalled_short_scoreboard_per_warp_active'
};

export const DATATYPE_CONVERSION_TYPE = {
    I2F: 'I2F',
    F2I: 'F2I',
    F2F: 'F2F'
};

export class DatatypeConversionAnalysis extends Analysis {
    constructor(analysisData, kernel) {
        super(
            analysisData,
            kernel,
            DATATYPE_CONVERSION_METRICS,
            (occurrenceData) => new DatatypeConversionOccurrence(occurrenceData)
        );
    }
}

export class DatatypeConversionOccurrence extends Occurrence {
    constructor(occurrenceData) {
        super(occurrenceData);

        /** @type {DATATYPE_CONVERSION_TYPE} */
        this.type = DATATYPE_CONVERSION_TYPE[occurrenceData['type']];
    }
}
