import { TEXT } from '../../../config/text';
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
        /** @type {Occurrence[]} */ this._occurrences = [];
        this.codeType = CODE_TYPE.NONE;

        if (analysisData['metrics']) {
            for (const [jsonMetricName, metricValue] of Object.entries(analysisData['metrics'])) {
                if (metricValue === null) {
                    this._metrics[jsonMetricName] = 0;
                } else if (typeof metricValue === 'object') {
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
     * @param {String} metric The name of the metric
     * @returns {Number} The value of the metric
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
     * @returns {Occurrence}
     */
    getOccurrencesAt(codeType, lineNumber) {
        if (codeType === CODE_TYPE.SOURCE_CODE) {
            return this._occurrences.filter((o) => o.sourceLineNumber === lineNumber);
        } else {
            return this._occurrences.filter((o) => o.binaryLineNumber === lineNumber);
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
        /** @type {Number} */ this.sourceLineNumber = occurrenceData['line_number'];
        /** @type {Number|String} */ this.binaryLineNumber =
            occurrenceData['pc_offset'] || parseInt(occurrenceData['line_number_raw']);

        this.data = occurrenceData;
    }

    linesToHighlight() {
        return [];
    }

    tokensToHighlight() {
        return {};
    }

    title() {
        return TEXT.code_view.code_info.default_occurrence_title;
    }

    description() {
        let resultString = 'Problem found:';
        for (const [key, value] of Object.entries(this.data)) {
            resultString += `\n- ${key}: ${value}`;
        }
        return resultString;
    }

    recommendations() {
        return '';
    }
}
