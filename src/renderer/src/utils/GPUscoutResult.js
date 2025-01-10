/**
 * @module
 * @author Tobias Stuckenberger
 * @description This module defines the GPUscout result
 */
import { ANALYSIS } from '../../../config/analyses';
import { CODE_TYPE } from '../stores/CodeViewerStore';
import { Analysis } from './Analysis';

/**
 * Defines the internal representation of a GPUscout result file
 * @class
 */
export class GPUscoutResult {
    /**
     * @param {String} resultData The content of the result.json file coming from GPUscout
     * @param {String} [topologyData] The content of the topology.csv file coming from mt4g
     */
    constructor(resultData, topologyData) {
        const resultJSON = JSON.parse(resultData);

        /**
         * An object containing all analyses by kernel and analysis name
         * @type {Object.<String, Object.<String, Analysis>>}
         */
        this._analyses = {};
        /**
         * All kernels mentioned in the GPUscout result
         * @type {String[]}
         */
        this._kernels = [];

        /**
         * All metrics contained in the GPUscout result
         * @type {Object.<String, Object.<String, Number>>}
         */
        this._metrics = {};
        /**
         * All topology metrics contained in the topology result file
         * @type {Object.<String, Object.<String, Number>>}
         */
        this._topology = {};

        /**
         * All SASS code lines
         * @type {Object.<String, Array.<{address: String, tokens: String[]}>>} */
        this._sassCodeLines = {};
        /**
         * The mapping of SASS to source code lines
         * @type {Object.<String, Object.<String, Object[]>>}
         */
        this._sassToSourceLines = {};

        /**
         *>>} All PTX code lines
         * @type {Object.<String, Array.<{address: Number, tokens: String[]}>>}
         */
        this._ptxCodeLines = {};
        /**
         * The mapping of PTX to source code lines
         * @type {Object.<String, Object.<String, Object[]>>}
         */
        this._ptxToSourceLines = {};

        /**
         * All source code lines
         * @type {Object.<String, Object[]>}
         */
        this._sourceCodeLines = {};
        /**
         * The mapping of source to SASS code lines
         * @type {Object.<String, Object.<String, String[]>>}
         */
        this._sourceToSassLines = {};
        /**
         * The mapping of source to PTX code lines
         * @type {Object.<String, Object.<String, Number[]>>}
         */
        this._sourceToPtxLines = {};

        this._mainSourceFileName = {};
        this._sourceFileNames = {};

        // Remove parameters from kernels where possible
        for (const kernel of Object.keys(resultJSON.kernels)) {
            const name = resultJSON.kernels[kernel].substring(0, resultJSON.kernels[kernel].indexOf('('));
            if (Object.values(resultJSON.kernels).filter((k) => k.startsWith(name + '(')).length === 1) {
                resultJSON.kernels[kernel] = name;
            }
        }

        // Save contents of passed source files with their paths
        const sourceFileContents = {};
        for (const [filePath, content] of Object.entries(resultJSON.source_files)) {
            sourceFileContents[filePath] = content.split('\n');
        }

        this._parseSassCode(
            resultJSON.binary_files.sass,
            resultJSON.binary_files.sass_registers,
            resultJSON.stalls,
            resultJSON.kernels
        );

        this._parsePtxCode(resultJSON.binary_files.ptx, resultJSON.kernels);

        // Not all kernels have ptx code available, we still need the keys in the objects
        for (const k of this._kernels) {
            if (!this._ptxCodeLines[k]) this._ptxCodeLines[k] = [];
            if (!this._ptxToSourceLines[k]) this._ptxToSourceLines[k] = [];
        }

        this._aggregateKernelSourceCode(sourceFileContents, resultJSON.stalls, resultJSON.kernels);

        if (!resultJSON.metrics) {
            // Prevent crash on no metrics
            resultJSON.metrics = {};
        }

        this._parseMetrics(resultJSON, topologyData);

        // Not all kernels have metrics, we still need the keys in the object
        for (const k of this._kernels) {
            if (!this._metrics[k]) this._metrics[k] = {};
        }

        // Add all supported analyses
        for (const [analysisName, analysisDefinition] of Object.entries(ANALYSIS)) {
            this._analyses[analysisName] = {};

            // Skip if analysis was not run
            if (!resultJSON.analyses[analysisDefinition.name]) continue;

            // Iterate over all kernels
            for (let [kernel, analysisData] of Object.entries(resultJSON.analyses[analysisDefinition.name])) {
                // Use demangled kernel name
                kernel = resultJSON['kernels'][kernel];

                // Create analysis
                this._analyses[analysisName][kernel] = new Analysis(
                    analysisData,
                    this._metrics[kernel],
                    this._topology,
                    kernel,
                    analysisDefinition.occurrence_constructor,
                    ANALYSIS[analysisName]['use_sass'] ? this._sassToSourceLines[kernel] : this._ptxToSourceLines[kernel]
                );
            }
        }
    }

    /**
     * @param {String} kernel The name of the kernel
     * @param {String} metric The name of the metric
     * @returns {Number} The correspoonding metric value
     */
    getMetric(kernel, metric) {
        return this._metrics[kernel][metric] || 0;
    }

    /**
     * @param {String} kernel The name of the kernel
     * @returns {String} The name of the main CUDA source file
     */
    getMainFileName(kernel) {
        return this._mainSourceFileName[kernel] || '';
    }

    /**
     * @param {String} kernel The name of the kernel
     * @returns {Array} The names of all source files
     */
    getSourceFileNames(kernel) {
        return this._sourceFileNames[kernel] || [];
    }

    /**
     * @param {String} kernel The name of the kernel
     * @returns {Number} The number of analyses, infos and warnings per kernel
     */
    getKernelInfo(kernel) {
        let analyses = this.getAnalysesWithOccurrences(kernel);
        let infos = analyses
            .map((analysis) => this._analyses[analysis][kernel].getOccurrences().filter((occ) => !occ.isWarning).length)
            .reduce((a, b) => a + b, 0);
        let warnings = analyses
            .map((analysis) => this._analyses[analysis][kernel].getOccurrences().filter((occ) => occ.isWarning).length)
            .reduce((a, b) => a + b, 0);
        return [analyses.length, infos, warnings];
    }

    /**
     * @param analysis The name of the analysis
     * @param kernel The name of the kernel
     * @returns {Analysis} The analysis with the specified name in the specified kernel
     */
    getAnalysis(analysis, kernel) {
        if (!this._analyses[analysis] || !this._analyses[analysis][kernel]) return undefined;
        return this._analyses[analysis][kernel];
    }

    /**
     * @param {String} kernel The name of the kernel
     * @returns {String[]} The names of all analyses with occurrences in this kernel
     */
    getAnalysesWithOccurrences(kernel) {
        return Object.keys(this._analyses).filter(
            (analysis) =>
                Object.entries(this._analyses[analysis]).filter(([k, a]) => kernel === k && a.getOccurrences().length > 0)
                    .length > 0
        );
    }

    /**
     * @param {String} kernel The name of the kernel
     * @param {String} codeType The selected code type
     * @param {String|Number} lineNumber The selected line number
     * @returns {String[]} All tokens of this line that belong to the instruction
     */
    getInstructionTokens(kernel, codeType, lineNumber) {
        if (codeType === CODE_TYPE.SASS_CODE) {
            let tokens = this._sassCodeLines[kernel]
                .filter((line) => line.address === lineNumber)
                .flatMap((line) => line.tokens);

            if (tokens.length > 0 && tokens[0] === '{') {
                // Line is start of dual issue { INST ...
                tokens = tokens.filter((_, i) => i >= tokens.findIndex((t) => t !== ' ' && t !== '{'));
            } else if (tokens.length > 0 && tokens[0].startsWith('@')) {
                // Line starts with predicate check @PX INST ...
                tokens = tokens.filter((_, i) => i > 1);
            }

            let index = tokens.findIndex((t) => t === ' ');
            return tokens.filter((t, i) => t !== '.' && i < (index > 0 ? index : tokens.length));
        } else {
            let tokens = this._ptxCodeLines[kernel]
                .filter((line) => line.address === lineNumber)
                .flatMap((line) => line.tokens);

            if (tokens.length > 0 && tokens[0].startsWith('@')) {
                // Line starts with predicate check @PX INST ...
                tokens = tokens.filter((_, i) => i > 1);
            }

            let index = tokens.findIndex((t) => t === ' ');
            return tokens.filter((t, i) => t !== '.' && i < (index > 0 ? index : tokens.length));
        }
    }

    /**
     * @param {String} kernel The name of the kernel
     * @param {String|Number} lineNumber The line number
     * @param {String} codeType The code type
     * @returns {Array.<Object.<String, Number>>} All PCSampling stalls occurring at this line
     */
    getLineStalls(kernel, lineNumber, codeType) {
        if (codeType === CODE_TYPE.SASS_CODE) {
            return this._sassCodeLines[kernel].findLast((l) => l.address === lineNumber)?.stalls || [];
        } else if (codeType === CODE_TYPE.SOURCE_CODE) {
            return this._sourceCodeLines[kernel].findLast((l) => l.address === lineNumber)?.stalls || [];
        }
        return [];
    }

    /**
     * @param {String} kernel The name of the kernel
     * @param {String} line The SASS line to get source lines for
     * @returns {Array} The file name and line number of the source line corresponding to this SASS line
     */
    getSassToSourceLine(kernel, line) {
        return this._sassToSourceLines[kernel][line];
    }

    /**
     * @param {String} kernel The name of the kernel
     * @param {String} line The PTX line to get source lines for
     * @returns {Array} The file name and line number of the source line corresponding to this SASS line
     */
    getPtxToSourceLine(kernel, line) {
        return this._ptxToSourceLines[kernel][line];
    }

    /**
     * @param {String} kernel The name of the kernel
     * @returns {Array.<{address: String, tokens: String[]}>} All SASS lines of this kernel
     */
    getSassCodeLines(kernel) {
        return this._sassCodeLines[kernel];
    }

    /**
     * @param {String} kernel The name of the kernel
     * @returns {Array.<{address: Number, tokens: String[]}>} All PTX lines of this kernel
     */
    getPtxCodeLines(kernel) {
        return this._ptxCodeLines[kernel];
    }

    /**
     * @param {String} kernel The name of the kernel
     * @returns {Array.<{address: Number, tokens: String[]}>} All source lines of this kernel
     */
    getSourceCodeLines(kernel) {
        return this._sourceCodeLines[kernel];
    }

    /**
     * @param {String} kernel The name of the kernel
     * @param {String} line The source line to get sass lines for
     * @returns {String[]} All SASS lines corresponding to this source line
     */
    getSourceToSassLines(kernel, line, file) {
        return this._sourceToSassLines[kernel][file][line] || [];
    }

    /**
     * @param {String} kernel The name of the kernel
     * @param {String} line The source line to get ptx lines for
     * @returns {Number[]} All PTX lines corresponding to this source line
     */
    getSourceToPtxLines(kernel, line, file) {
        return this._sourceToPtxLines[kernel][file][line] || [];
    }

    /**
     * @returns {String[]} The names of all kernels in this GPUscout result
     */
    getKernels() {
        return this._kernels;
    }

    /**
     * @returns {Object.<String, Object.<String, Analysis>>} All analyses in this GPUscout result
     */
    getAnalyses() {
        return this._analyses;
    }

    /**
     * Parse the ptx code and extract the mapping to the source code
     * @param {String} ptxCode The generated ptx source code
     * @param {Object.<String, String>} kernels The mapping of kernel names to their demangled names
     */
    _parsePtxCode(ptxCode, kernels) {
        let currentSourceLine = -1;
        let currentKernel = '';
        let currentSourceFile = '';
        let currentPtxLine = 1;
        let isInFileDefinitions = false;
        let lastLineBranch = '';

        for (const line of ptxCode.split('\n')) {
            if (currentSourceLine === -1 && !line.startsWith('.loc') && !line.includes('.entry')) {
                // Skip to first kernel
                continue;
            }
            if (line.includes('.entry')) {
                // .visible .entry KERNEL_NAME(
                // We are at the beginning of a new kernel -> Reset source and PTX lines, set new currentKernel
                currentSourceLine = 0;
                currentPtxLine = 1;
                currentKernel = kernels[line.split(' ').at(-1).replace('(', '')];

                if (Object.keys(this._ptxCodeLines).includes(currentKernel)) {
                    // Kernel already represented -> Skip
                    currentSourceLine = -1;
                    continue;
                    alert(
                        'Multiple definitions for the same kernel found in the PTX Code. Please make sure the program is compiled for a single target architecture.'
                    );
                    window.location.reload();
                    return;
                }
                this._ptxToSourceLines[currentKernel] = {};
                this._ptxCodeLines[currentKernel] = [
                    {
                        address: currentPtxLine++,
                        tokens: line
                            .slice(0, -1)
                            .split(/([, :;.])/)
                            .filter((token) => token.length > 0)
                    }
                ];
            } else if (line.startsWith('.loc\t')) {
                // .loc	1 3 0
                // OR
                // .loc 1 3 0, function_name $FN_NAME, inlined_at 1 3 0
                // This line describes a source-to-ptx line mapping -> Save the current line and file index
                if (currentSourceLine === -1) {
                    currentSourceLine = 0;
                }
                const sourceLine = parseInt(line.split(' ').at(-2));
                const file = line.replace('.loc\t', '').split(' ').at(-3);

                currentSourceLine = sourceLine;
                currentSourceFile = file;
            } else if (line.includes('.file')) {
                // .file	1 "/home/tobias/Coding/Studium/cuda-scripts/multiple_kernels.cu"
                // This line maps a previously used file index to a file name -> Replace all mentions of the file index with the name
                const fileIndex = line.replace('.file\t', '').split(' ').at(-2);
                const fileName = line.split(' ').at(-1).replaceAll('"', '');
                for (const kernel of Object.keys(this._ptxToSourceLines)) {
                    for (const line of Object.keys(this._ptxToSourceLines[kernel])) {
                        if (this._ptxToSourceLines[kernel][line]['file'] === fileIndex) {
                            this._ptxToSourceLines[kernel][line]['file'] = fileName;
                        }
                    }
                }
                isInFileDefinitions = true;
            } else {
                if (isInFileDefinitions) continue;
                // OPERATION PARAM1, PARAM2, ...;
                // OR
                // LABEL:
                // This line is a normal PTX line (instruction or label)  -> save the address and tokens
                const isLabel = line.endsWith(':');

                if (currentSourceLine !== 0) {
                    this._ptxToSourceLines[currentKernel][currentPtxLine] = {
                        line: currentSourceLine,
                        file: currentSourceFile
                    };
                }

                if (isLabel) {
                    lastLineBranch = line.substring(0, line.length - 1);
                } else if (lastLineBranch !== '') {
                    // Update address of branch entry if this is the first instruction after it -> Branch entry should have the same address as the first line after it
                    this._ptxCodeLines[currentKernel].find(
                        (line) => line.tokens.includes(lastLineBranch) && line.address === -1
                    ).address = currentPtxLine;
                    lastLineBranch = '';
                }

                this._ptxCodeLines[currentKernel].push({
                    address: isLabel ? -1 : currentPtxLine,
                    tokens: line
                        .slice(0, -1)
                        .split(/([+-, :;.])/)
                        .filter((token) => token.length > 0)
                });

                if (!isLabel) currentPtxLine++;
            }
        }
    }

    /**
     * Parse the sass code and extract the mapping to the source code
     * @param {String} sassCode The generated sass source code
     * @param {String} sassRegisters The sass code with register information
     * @param {Object.<String, Array<{line_number: Number, pc_offset: String, stalls: Array.<Array.<Number, String>>}>>} stalls An object containing all recorded pc sampling stalls
     * @param {Object.<String, String>} kernels The mapping of kernel names to their demangled names
     */
    _parseSassCode(sassCode, sassRegisters, stalls, kernels) {
        let currentSourceLine = -1;
        let currentKernel = '';
        let currentSourceFile = '';
        let currentSassLine = '';
        let lastLineBranch = '';
        let relevantStalls = [];
        let totalStalls = 0;
        // Map each line number with the line containing the register information
        let sassRegisterMap = Object.fromEntries(
            sassRegisters
                .split('\n')
                .filter((line) => line.includes('/*'))
                .map((line) => [line.substring(line.indexOf('/*') + 2, line.indexOf('*/')), line])
        );

        for (let line of sassCode.split('\n')) {
            if (currentSourceLine === -1 && !line.startsWith('.text')) {
                // Skip to the first text section
                continue;
            }
            if (line.startsWith('.text')) {
                // .text.KERNEL_NAME:
                // We are at the beginning of a new kernel -> Set of relevant maps and change currentKernel and code lines
                currentSourceLine = 0;
                currentSassLine = '';
                currentKernel =
                    kernels[line.replace('.text.', '').replace(':', '')] || line.replace('.text.', '').replace(':', '');
                // Not all kernels are analyzed by GPUscout, so not every kernel is known
                if (currentKernel !== line.replace('.text.', '').replace(':', '')) this._kernels.push(currentKernel);

                lastLineBranch = '';
                relevantStalls = stalls[line.replace('.text.', '').replace(':', '')] || [];
                totalStalls = relevantStalls.flatMap((s) => s['stalls'].map((st) => st[1])).reduce((a, b) => a + b, 0);

                this._sassToSourceLines[currentKernel] = {};
                this._sassCodeLines[currentKernel] = [
                    {
                        address: '0000',
                        tokens: line
                            .trim()
                            .split(/([+-,.:[\]() ])/)
                            .filter((token) => token.length > 0),
                        liveRegisters: [0, 0],
                        stalls: {}
                    }
                ];
            } else if (line.includes('//##')) {
                // //## File "FILE_PATH", line LINE_NUMBER
                // This line maps the following SASS lines to a certain source file and line number -> save both
                const sourceLine = parseInt(line.split(' ').at(-1));
                const file = line.substring(line.indexOf('"') + 1, line.lastIndexOf('"'));

                currentSourceLine = sourceLine;
                currentSourceFile = file;
            } else if (line !== '') {
                // /*ADDRESS*/                   OPERATION PARAM1, PARAM2, ... ;
                // OR
                // .LABEL:
                // This line is a regular SASS line (instruction or label) -> Save all relevant information
                let address = '';
                let liveRegisters = [];

                if (line.includes('/*')) {
                    // This line is a instruction
                    address = line.substring(line.indexOf('/*') + 2, line.indexOf('*/'));
                    line = line.replace(/\/\*.*\*\//, '');
                    currentSassLine = address;

                    this._sassToSourceLines[currentKernel][currentSassLine] = {
                        line: currentSourceLine,
                        file: currentSourceFile
                    };
                    // Update address of branch entry if this is the first instruction after it
                    if (lastLineBranch !== '') {
                        this._sassCodeLines[currentKernel].find((lines) => lines.address === lastLineBranch).address =
                            address;
                        lastLineBranch = '';
                    }

                    // Save live register info
                    if (sassRegisterMap[address]) {
                        liveRegisters = sassRegisterMap[address]
                            .split('|')
                            .filter((_, i, s) => i >= s.length - 3 && i < s.length - 1)
                            .map((e) => parseInt(e.trim() || '0'));
                    }
                } else if (line.endsWith(':')) {
                    // This line is a label
                    address = line.substring(0, line.length - 1);
                    lastLineBranch = line.substring(0, line.length - 1);
                } else {
                    continue;
                }

                // Get stalls for this line
                const lineStalls = Object.fromEntries(
                    relevantStalls
                        .filter((s) => s['pc_offset'].padStart(4, '0') === address)
                        .flatMap((s) => s['stalls'])
                        .filter((stall) => !stall[0].endsWith('not_issued'))
                );
                if (Object.keys(lineStalls).length > 0) {
                    lineStalls['total'] = totalStalls;
                }

                this._sassCodeLines[currentKernel].push({
                    address: address,
                    tokens: line
                        .trim()
                        .split(/([+-,.:[\]() ])/)
                        .filter((token) => token.length > 0),
                    liveRegisters: liveRegisters,
                    stalls: lineStalls
                });
            } else {
                // We are at the end of a kernel
                currentSourceLine = -1;
            }
        }
    }

    /**
     * Uses the SASS and PTX line mappings to extract the source code per kernel
     * @param {{String, String}} sourceFileContents The contents of the cuda source files
     * @param {Object.<String, Array.<{line_number: Number, pc_offset: String, stalls: Array.<Array.<Number, String>>}>>} stalls An object containing all recorded pc sampling stalls
     */
    _aggregateKernelSourceCode(sourceFileContents, stalls) {
        for (const kernel of this._kernels) {
            // Get relevant lines for this kernel by source files
            let relevantLines = Object.groupBy(
                Object.values(this._sassToSourceLines[kernel]).concat(Object.values(this._ptxToSourceLines[kernel])),
                ({ file }) => file
            );
            let relevantStalls = stalls[kernel] || [];
            let totalStalls = relevantStalls.flatMap((s) => s['stalls'].map((st) => st[1])).reduce((a, b) => a + b, 0);

            let lineNumber = 1;
            const oldToNewLineNumbers = {};

            this._sourceCodeLines[kernel] = [];
            this._sourceFileNames[kernel] = [];

            for (let [sourceFile, lineNumbers] of Object.entries(relevantLines)) {
                if (!this._mainSourceFileName[kernel]) {
                    this._mainSourceFileName[kernel] = sourceFile;
                }
                if (!this._sourceFileNames[kernel].includes(sourceFile)) {
                    this._sourceFileNames[kernel].push(sourceFile);
                }

                // Get relevant line section in source file
                lineNumbers = lineNumbers.map((ln) => ln['line']);
                let fileLineNumber = 1;

                let fileIsRelevantForSASS =
                    Object.values(this._sassToSourceLines[kernel]).filter((l) => l.file === sourceFile).length > 0;
                let fileIsRelevantForPTX =
                    Object.values(this._ptxToSourceLines[kernel]).filter((l) => l.file === sourceFile).length > 0;

                // The new line numbers dont match the old ones, save the mapping
                oldToNewLineNumbers[sourceFile] = {};

                // Add lines
                for (let i = 1; i <= sourceFileContents[sourceFile].length; i++) {
                    oldToNewLineNumbers[sourceFile][i] = fileLineNumber;
                    // Aggregate the stalls for this line
                    const lineStalls = Object.fromEntries(
                        relevantStalls
                            .filter((s) => s['line_number'] === lineNumber++)
                            .flatMap((s) => s['stalls'])
                            .reduce((a, b) => {
                                a.find((x) => x[0] === b[0]) ? (a.find((x) => x[0] === b[0])[1] += b[1]) : a.push(b);
                                return a;
                            }, [])
                    );
                    if (Object.keys(lineStalls).length > 0) {
                        // Save the total stalls in a separate key for convenience
                        lineStalls['total'] = totalStalls;
                    }

                    this._sourceCodeLines[kernel].push({
                        address: fileLineNumber++,
                        tokens: [sourceFileContents[sourceFile][i - 1]], // The tokens of this line
                        stalls: lineStalls,
                        hasSassMapping: false,
                        hasPtxMapping: false,
                        hasSassRelevance: fileIsRelevantForSASS,
                        hasPtxRelevance: fileIsRelevantForPTX,
                        fileName: sourceFile
                    });
                }
            }

            // Apply the new line number mapping to all the objects

            for (const key of Object.keys(this._sassToSourceLines[kernel])) {
                this._sassToSourceLines[kernel][key] = [
                    this._sassToSourceLines[kernel][key]['file'],
                    oldToNewLineNumbers[this._sassToSourceLines[kernel][key]['file']][
                        this._sassToSourceLines[kernel][key]['line']
                    ]
                ];
            }
            for (const key of Object.keys(this._ptxToSourceLines[kernel])) {
                this._ptxToSourceLines[kernel][key] = [
                    this._ptxToSourceLines[kernel][key]['file'],
                    oldToNewLineNumbers[this._ptxToSourceLines[kernel][key]['file']][
                        this._ptxToSourceLines[kernel][key]['line']
                    ]
                ];
            }
            this._sourceToSassLines[kernel] = {};
            for (const [sassLine, key] of Object.entries(this._sassToSourceLines[kernel])) {
                if (!this._sourceToSassLines[kernel][key[0]]) this._sourceToSassLines[kernel][key[0]] = {};
                if (!this._sourceToSassLines[kernel][key[0]][key[1]]) this._sourceToSassLines[kernel][key[0]][key[1]] = [];

                this._sourceToSassLines[kernel][key[0]][key[1]].push(sassLine);
                this._sourceCodeLines[kernel].find((l) => l.fileName === key[0] && l.address === key[1]).hasSassMapping =
                    true;
            }
            this._sourceToPtxLines[kernel] = {};
            for (const [ptxLine, key] of Object.entries(this._ptxToSourceLines[kernel])) {
                if (!this._sourceToPtxLines[kernel][key[0]]) [(this._sourceToPtxLines[kernel][key[0]] = {})];
                if (!this._sourceToPtxLines[kernel][key[0]][key[1]]) this._sourceToPtxLines[kernel][key[0]][key[1]] = [];

                this._sourceToPtxLines[kernel][key[0]][key[1]].push(ptxLine);
                this._sourceCodeLines[kernel].find((l) => l.fileName === key[0] && l.address === key[1]).hasPtxMapping =
                    true;
            }
        }
    }

    /**
     * Parse metrics and optionally the topology csv data
     * @param {Object} resultJSON The JSON-formatted GPUscout result file
     * @param {String} topologyData The content of the topology result file
     */
    _parseMetrics(resultJSON, topologyData) {
        for (const kernel of Object.keys(resultJSON['metrics'])) {
            // Loop through all kernels
            this._metrics[resultJSON['kernels'][kernel]] = {};

            for (const [key, value] of Object.entries(resultJSON['metrics'][kernel])) {
                // Loop through all keys
                if (typeof value === 'object') {
                    // Some metrics are nested in another level of objects
                    for (const [deepJsonMetricName, deepMetricValue] of Object.entries(value)) {
                        this._metrics[resultJSON['kernels'][kernel]][`${key}/${deepJsonMetricName}`] = deepMetricValue;
                    }
                } else {
                    this._metrics[resultJSON['kernels'][kernel]][key] = value;
                }
            }
        }

        if (!topologyData) return;

        topologyData = topologyData.split('\n').map((line) => line.split(';'));
        // Indices of the titles in each row
        const lineToVarnames = [
            [1, 3],
            [1, 3, 5, 7],
            [1, 4],
            [1, 4, 6],
            [1, 5, 8, 11, 14, 16, 18, 20, 22],
            [1, 5, 8, 11, 14, 16],
            [1, 5, 8, 11, 14, 16, 18, 20],
            [1, 5, 8, 11, 14, 16, 18, 20],
            [1, 5, 8, 11, 14, 16, 18],
            [1, 5, 8, 11, 14],
            [1, 5, 8, 11],
            [1, 5, 8, 11]
        ];

        for (const [lineIndex, varIndices] of lineToVarnames.entries()) {
            // The first entry in each line is the category
            const category = topologyData[lineIndex][0].toLowerCase();

            for (let i = 0; i < varIndices.length; i++) {
                // Get variable name and value
                const varName = topologyData[lineIndex][varIndices[i]].toLowerCase().replaceAll('"', '').trim();
                let varValue = topologyData[lineIndex][varIndices[i] + 1].trim();
                // A second variable indicated the unit, if present
                let varUnit =
                    i < varIndices.length - 1 && varIndices[i + 1] - varIndices[i] >= 2
                        ? topologyData[lineIndex][varIndices[i] + 2].replaceAll('"', '')
                        : '';

                // Parse value according to format
                if (varValue.includes('"')) {
                    varValue = varValue.replaceAll('"', '');
                } else {
                    varValue = varValue.includes('.') ? parseFloat(varValue) : parseInt(varValue);
                }

                // Save metric (and unit)
                this._topology[`${category}/${varName}`] = varValue;
                if (varUnit) {
                    this._topology[`${category}/${varName}_unit`] = varUnit;
                }
            }
        }
    }
}
