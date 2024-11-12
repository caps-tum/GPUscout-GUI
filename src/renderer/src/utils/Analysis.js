import { TEXT } from '../../../config/text';
import { CODE_TYPE } from '../stores/CodeViewerStore';

export class Analysis {
    /**
     * @param {Object} analysisData The data of the analysis
     * @param {Object} metrics All general metrics of the result
     * @param {Object} topologyMetrics The relevant metrics of the GPU topology
     * @param {String} kernel The name of the kernel
     * @param {Function} occurrenceConstructor A function returning a new instance of an occurrence element
     */
    constructor(analysisData, metrics, topologyMetrics, kernel, occurrenceConstructor = (o) => new Occurrence(o)) {
        this._kernel = kernel;
        this._metrics = metrics || {};
        this._ownMetrics = {};
        this._topologyMetrics = topologyMetrics;
        /** @type {Occurrence[]} */ this._occurrences = [];
        this.codeType = CODE_TYPE.NONE;

        // Add metrics
        if (analysisData['metrics']) {
            for (const [jsonMetricName, metricValue] of Object.entries(analysisData['metrics'])) {
                if (metricValue === null) {
                    // Metric not found
                    this._metrics[jsonMetricName] = 0;
                    this._ownMetrics[jsonMetricName] = 0;
                } else if (typeof metricValue === 'object') {
                    // Metric is nested -> Metric name is of form 'category/metric'
                    for (const [deepJsonMetricName, deepMetricValue] of Object.entries(metricValue)) {
                        this._metrics[`${jsonMetricName}/${deepJsonMetricName}`] = deepMetricValue;
                        this._ownMetrics[`${jsonMetricName}/${deepJsonMetricName}`] = deepMetricValue;
                    }
                } else {
                    this._metrics[jsonMetricName] = metricValue;
                    this._ownMetrics[jsonMetricName] = metricValue;
                }
            }
        }

        // Add occurrences
        if (analysisData['occurrences']) {
            for (const occurrence of analysisData['occurrences']) {
                this._occurrences.push(occurrenceConstructor(occurrence));
            }
        }
    }

    /**
     * @returns {Object.<String, Number>} All metrics of this analysis
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
     * @returns {Object.<String, Number>} All metrics of only this analysis
     */
    getOwnMetrics() {
        return this._ownMetrics;
    }

    /**
     * @param {String} metric The name of the metric
     * @returns {Number} The value of the metric
     */
    getTopologyMetric(metric) {
        return this._topologyMetrics[metric] || 0;
    }

    hasTopologyMetrics() {
        return this._topologyMetrics !== undefined && Object.keys(this._topologyMetrics).length > 0;
    }

    /**
     * @returns {Occurrence[]} All occurrences of this analysis
     */
    getOccurrences() {
        return this._occurrences;
    }

    /**
     * @param {String} codeType The code type the line number belongs to
     * @param {String|Number} lineNumber The line number of the occurrence
     * @returns {Occurrence} The occurrence at the specified line number
     */
    getOccurrencesAt(codeType, lineNumber) {
        if (codeType === CODE_TYPE.SOURCE_CODE) {
            return this._occurrences.filter((o) => o.sourceLineNumber === lineNumber);
        } else {
            return this._occurrences.filter((o) => o.binaryLineNumber === lineNumber);
        }
    }

    /**
     * @returns {String} The name of the current kernel
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

    /**
     * The code lines to highlight when this occurrence is selected
     * @returns {String[]|Number[]}
     */
    linesToHighlight() {
        return [];
    }

    /**
     * The tokens to highlight on the highlighted code lines
     * Format:
     * Key: The line(s) to highlight these tokens on (for example '5', '<5', '<=5', '>5', '>=5') (use numbers for source os ptx code ex. 5 and hex for sass code ex. 0005)
     * Value: A object with the token to highlight as the key and the color of the highlight as the value
     * Example: {'<5': { 'R1': CODE_BINARY_TOKEN_COLORS.REGISTER_1 }} to highlight all occurrences of the string 'R1' in the first 4 lines
     * @returns {Object}
     */
    tokensToHighlight() {
        return {};
    }

    /**
     * The title to display in the code view
     * @returns {String}
     */
    title() {
        return TEXT.code_view.code_info.default_occurrence_title;
    }

    /**
     * The description to display in the code view
     * @returns {String}
     */
    description() {
        let resultString = 'Problem found:';
        for (const [key, value] of Object.entries(this.data)) {
            resultString += `\n- ${key}: ${value}`;
        }
        return resultString;
    }

    /**
     * The recommendations to display in the code view
     * @returns {String}
     */
    recommendations() {
        return '';
    }
}
