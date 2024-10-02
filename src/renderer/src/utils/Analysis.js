import { CODE_TYPE } from '../stores/CodeViewerStore';

export class Analysis {
    /**
     * @param {Object} analysisData The data of the analysis
     * @param {String} kernel The name of the kernel
     * @param {Function} occurrenceConstructor A function returning a new instance of an occurrence element
     */
    constructor(analysisData, kernel, occurrenceConstructor = (o) => new Occurrence(o)) {
        this._kernel = kernel;
        this._metrics = {};
        this._occurrences = [];
        this.codeType = CODE_TYPE.NONE;

        if (analysisData['metrics']) {
            for (const [jsonMetricName, metricValue] of Object.entries(analysisData['metrics'])) {
                if (typeof metricValue === Object) {
                    for (const [deepJsonMetricName, deepMetricValue] of Object.entries(metricValue)) {
                        this._metrics[`${jsonMetricName}/${deepJsonMetricName}`] = deepMetricValue;
                    }
                } else {
                    this._metrics[jsonMetricName] = metricValue;
                }
            }
        }

        if (analysisData['occurrences']) {
            for (const occurrence of analysisData['occurrences']) {
                this._occurrences.push(occurrenceConstructor(occurrence));
            }
        }
    }

    /**
     * @returns {Object.<String, Number>}
     */
    getMetrics() {
        return this._metrics;
    }

    /**
     * @param metric The name of the metric
     * @returns {Number}
     */
    getMetric(metric) {
        return this._metrics[metric] || 0;
    }

    /**
     * @returns {Occurrence[]}
     */
    getOccurrences() {
        return this._occurrences;
    }

    /**
     * @param {String|Number} lineNumber
     * @param {Boolean} isSource
     */
    checkOccurrence(lineNumber, isSource) {
        if (isSource) {
            return this._occurrences.find((occurrence) => occurrence.sourceLineNumber === lineNumber) || null;
        } else {
            return this._occurrences.find((occurrence) => occurrence.binaryLineNumber === lineNumber) || null;
        }
    }

    /**
     * @returns {String}
     */
    getKernel() {
        return this._kernel;
    }
}

export class Occurrence {
    /**
     * @param occurrenceData The data of this occurrence
     */
    constructor(occurrenceData) {
        /** @type {Number} */
        this.sourceLineNumber = occurrenceData['line_number'];
        /** @type {Number|String} */
        this.binaryLineNumber = occurrenceData['pc_offset'] || parseInt(occurrenceData['line_number_raw']);
    }
}
