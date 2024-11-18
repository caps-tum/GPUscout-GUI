import { ANALYSIS } from '../../../config/analyses';
import { CODE_TYPE } from '../stores/CodeViewerStore';
import { Analysis } from './Analysis';

export class GPUscoutResult {
    constructor(resultData, topologyData) {
        const resultJSON = JSON.parse(resultData);

        this._analyses = {};
        this._kernels = [];

        this._metrics = {};
        this._topology = {};

        this._sassCodeLines = {};
        this._sassToSourceLines = {};

        this._ptxCodeLines = {};
        this._ptxToSourceLines = {};

        this._sourceCodeLines = {};
        this._sourceToSassLines = {};
        this._sourceToPtxLines = {};

        const sourceFileContents = {};
        for (const [filePath, content] of Object.entries(resultJSON['source_files'])) {
            sourceFileContents[filePath] = content.split('\n');
        }

        this._parseSassCode(
            resultJSON['binary_files']['sass'],
            resultJSON['binary_files']['sass_registers'],
            resultJSON['stalls'],
            resultJSON['kernels']
        );
        this._parsePtxCode(resultJSON['binary_files']['ptx'], resultJSON['kernels']);

        this._aggregateKernelSourceCode(sourceFileContents, resultJSON['stalls'], resultJSON['kernels']);

        this._parseMetrics(resultJSON, topologyData);

        // Add analyses
        for (const [analysisName, analysisDefinition] of Object.entries(ANALYSIS)) {
            this._analyses[analysisName] = {};

            if (!resultJSON['analyses'][analysisDefinition.name]) continue;

            // Iterate over all kernels
            for (let [kernel, analysisData] of Object.entries(resultJSON['analyses'][analysisDefinition.name])) {
                kernel = resultJSON['kernels'][kernel];

                // Create analysis
                const metrics = this._metrics[kernel];
                this._analyses[analysisName][kernel] = new Analysis(
                    analysisData,
                    metrics,
                    this._topology,
                    kernel,
                    analysisDefinition.occurrence_constructor
                );
            }
        }
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
            let tokens = this._sassCodeLines[kernel].find((line) => line.address === lineNumber).tokens;

            if (tokens.length > 0 && tokens[0] === '{') {
                // Line is start of dual issue { INST ...
                tokens = tokens.filter((_, i) => i >= tokens.findIndex((t) => t !== ' ' && t !== '{'));
            } else if (tokens.length > 0 && tokens[0].startsWith('@')) {
                // Line starts with predicate check @PX INST ...
                tokens = tokens.filter((_, i) => i > 1);
            }

            let index = tokens.findIndex((t) => t === ' ');
            return tokens.filter((_, i) => i < (index > 0 ? index : tokens.length));
        } else {
            let tokens = this._ptxCodeLines[kernel].find((line) => line.address === lineNumber).tokens;

            if (tokens.length > 0 && tokens[0].startsWith('@')) {
                // Line starts with predicate check @PX INST ...
                tokens = tokens.filter((_, i) => i > 1);
            }

            let index = tokens.findIndex((t) => t === ' ');
            return tokens.filter((_, i) => i < (index > 0 ? index : tokens.length));
        }
    }

    /**
     * @param {String} kernel The name of the kernel
     * @param {String|Number} line The selected line
     * @param {String} codeType The selected code type
     * @returns {Object.<String, Number>[]} All PCSampling stalls occurring at this line
     */
    getLineStalls(kernel, line, codeType) {
        if (codeType === CODE_TYPE.SASS_CODE) {
            return this._sassCodeLines[kernel].findLast((l) => l.address === line)?.stalls || [];
        } else if (codeType === CODE_TYPE.SOURCE_CODE) {
            return this._sourceCodeLines[kernel].findLast((l) => l.address === line)?.stalls || [];
        }
        return [];
    }

    /**
     * @param {String} kernel The name of the kernel
     * @param {String} line The line to get source lines for
     * @returns {Number} The line number of the source line corresponding to this SASS line
     */
    getSassToSourceLine(kernel, line) {
        return this._sassToSourceLines[kernel][line];
    }

    /**
     * @param {String} kernel The name of the kernel
     * @param {String} line The line to get source lines for
     * @returns {Number} The line number of the source line corresponding to this PTX line
     */
    getPtxToSourceLine(kernel, line) {
        return this._ptxToSourceLines[kernel][line];
    }

    /**
     * @param {String} kernel The name of the kernel
     * @returns {{address: String, tokens: String[]}[]} All SASS lines of this kernel
     */
    getSassCodeLines(kernel) {
        return this._sassCodeLines[kernel];
    }

    /**
     * @param {String} kernel The name of the kernel
     * @returns {{address: Number, tokens: String[]}[]} All PTX lines of this kernel
     */
    getPtxCodeLines(kernel) {
        return this._ptxCodeLines[kernel];
    }

    /**
     * @param {String} kernel The name of the kernel
     * @returns {{address: Number, tokens: String[]}[]} All source lines of this kernel
     */
    getSourceCodeLines(kernel) {
        return this._sourceCodeLines[kernel];
    }

    /**
     * @param {String} kernel The name of the kernel
     * @param {String} line The line to get sass lines for
     * @returns {String[]} All SASS lines corresponding to this source line
     */
    getSourceToSassLines(kernel, line) {
        return this._sourceToSassLines[kernel][line] || [];
    }

    /**
     * @param {String} kernel The name of the kernel
     * @param {String} line The line to get ptx lines for
     * @returns {Number[]} All PTX lines corresponding to this source line
     */
    getSourceToPtxLines(kernel, line) {
        return this._sourceToPtxLines[kernel][line] || [];
    }

    getKernels() {
        return this._kernels;
    }

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
            if (currentSourceLine === -1 && !line.startsWith('.loc') && !line.includes('.visible')) {
                // Skip to first kernel
                continue;
            }
            if (line.includes('.visible')) {
                // .visible .entry KERNEL_NAME(
                currentSourceLine = 0;
                currentPtxLine = 1;
                currentKernel = kernels[line.split(' ').at(-1).replace('(', '')];

                this._ptxToSourceLines[currentKernel] = {};
                this._ptxCodeLines[currentKernel] = [];

                this._ptxCodeLines[currentKernel].push({
                    address: currentPtxLine++,
                    tokens: line
                        .slice(0, -1)
                        .split(/([, :;.])/)
                        .filter((token) => token.length > 0)
                });
            } else if (line.startsWith('.loc')) {
                // .loc	1 3 0
                // OR
                // .loc 1 3 0, function_name $FN_NAME, inlined_at 1 3 0
                if (currentSourceLine === -1) {
                    currentSourceLine = 0;
                }
                const sourceLine = parseInt(line.split(' ').at(-2));
                const file = line.replace('.loc\t', '').split(' ').at(-3);

                currentSourceLine = sourceLine;
                currentSourceFile = file;
            } else if (line.includes('.file')) {
                // .file	1 "/home/tobias/Coding/Studium/cuda-scripts/multiple_kernels.cu"
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
                    // Update address of branch entry if this is the first instruction after it
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
     * @param {Object.<String, {line_number: Number, pc_offset: String, stalls: {Number|String}[][]}[]>} stalls An object containing all recorded pc sampling stalls
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
                currentSourceLine = 0;
                currentSassLine = '';
                currentKernel = kernels[line.replace('.text.', '').replace(':', '')];
                lastLineBranch = '';
                relevantStalls = stalls[line.replace('.text.', '').replace(':', '')] || [];
                totalStalls = relevantStalls.flatMap((s) => s['stalls'].map((st) => st[1])).reduce((a, b) => a + b, 0);

                this._sassToSourceLines[currentKernel] = {};
                this._sassCodeLines[currentKernel] = [];
                this._kernels.push(currentKernel);

                this._sassCodeLines[currentKernel].push({
                    address: '0000',
                    tokens: line
                        .trim()
                        .split(/([+-,.:[\]() ])/)
                        .filter((token) => token.length > 0),
                    liveRegisters: [0, 0],
                    stalls: {}
                });
            } else if (line.includes('//##')) {
                // //## File "FILE_PATH", line LINE_NUMBER
                const sourceLine = parseInt(line.split(' ').at(-1));
                const file = line.substring(line.indexOf('"') + 1, line.lastIndexOf('"'));

                currentSourceLine = sourceLine;
                currentSourceFile = file;
            } else if (line !== '') {
                // /*ADDRESS*/                   OPERATION PARAM1, PARAM2, ... ;
                // OR
                // .LABEL:
                let address = '';
                let liveRegisters = [];
                if (line.includes('/*')) {
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
                    address = line.substring(0, line.length - 1);
                    lastLineBranch = line.substring(0, line.length - 1);
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
     * @param {Object.<String, {line_number: Number, pc_offset: String, stalls: {Number|String}[][]}[]>} stalls An object containing all recorded pc sampling stalls
     */
    _aggregateKernelSourceCode(sourceFileContents, stalls) {
        for (const kernel of this._kernels) {
            // Get relevant lines and in all source files
            let relevantLines = Object.groupBy(
                Object.values(this._sassToSourceLines[kernel]).concat(Object.values(this._ptxToSourceLines[kernel])),
                ({ file }) => file
            );
            let relevantStalls = stalls[kernel] || [];
            let totalStalls = relevantStalls.flatMap((s) => s['stalls'].map((st) => st[1])).reduce((a, b) => a + b, 0);

            let lineNumber = 1;
            const oldToNewLineNumbers = {};

            this._sourceCodeLines[kernel] = [];

            for (let [sourceFile, lineNumbers] of Object.entries(relevantLines)) {
                // Get relevant line section in source file
                lineNumbers = lineNumbers.map((ln) => ln['line']);
                const minLine = 1;
                const maxLine = sourceFileContents[sourceFile].length;

                // The new line numbers dont match the old ones, save the mapping
                oldToNewLineNumbers[sourceFile] = {};

                if (Object.keys(relevantLines).length > 1) {
                    this._sourceCodeLines[kernel].push({
                        address: -1,
                        tokens: ['File: ' + sourceFile],
                        stalls: {}
                    });
                }

                // Add lines
                for (let i = minLine; i <= maxLine; i++) {
                    oldToNewLineNumbers[sourceFile][i] = lineNumber;
                    // Aggregate the stalls for this line
                    const lineStalls = Object.fromEntries(
                        relevantStalls
                            .filter((s) => s['line_number'] === lineNumber)
                            .flatMap((s) => s['stalls'])
                            .reduce((a, b) => {
                                a.find((x) => x[0] === b[0]) ? (a.find((x) => x[0] === b[0])[1] += b[1]) : a.push(b);
                                return a;
                            }, [])
                    );
                    if (Object.keys(lineStalls).length > 0) {
                        lineStalls['total'] = totalStalls;
                    }

                    this._sourceCodeLines[kernel].push({
                        address: lineNumber,
                        tokens: sourceFileContents[sourceFile][i - 1].split(/([ ,(){};+\-*<>=%&./])/),
                        stalls: lineStalls
                    });
                    lineNumber++;
                }
                this._sourceCodeLines[kernel].push({
                    address: lineNumber,
                    tokens: [],
                    stalls: {}
                });
                lineNumber++;
            }

            // Apply the new line number mapping to all the mappings
            for (const key of Object.keys(this._sassToSourceLines[kernel])) {
                this._sassToSourceLines[kernel][key] =
                    oldToNewLineNumbers[this._sassToSourceLines[kernel][key]['file']][
                        this._sassToSourceLines[kernel][key]['line']
                    ];
            }
            for (const key of Object.keys(this._ptxToSourceLines[kernel])) {
                this._ptxToSourceLines[kernel][key] =
                    oldToNewLineNumbers[this._ptxToSourceLines[kernel][key]['file']][
                        this._ptxToSourceLines[kernel][key]['line']
                    ];
            }
            this._sourceToSassLines[kernel] = {};
            for (const key of [...new Set(Object.values(this._sassToSourceLines[kernel]))]) {
                this._sourceToSassLines[kernel][key] = Object.entries(this._sassToSourceLines[kernel])
                    .filter(([, v]) => v === parseInt(key))
                    .map(([k]) => k);
            }
            this._sourceToPtxLines[kernel] = {};
            for (const key of [...new Set(Object.values(this._ptxToSourceLines[kernel]))]) {
                this._sourceToPtxLines[kernel][key] = Object.entries(this._ptxToSourceLines[kernel])
                    .filter(([, v]) => v === parseInt(key))
                    .map(([k]) => parseInt(k));
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
            this._metrics[resultJSON['kernels'][kernel]] = {};
            for (const [key, value] of Object.entries(resultJSON['metrics'][kernel])) {
                if (typeof value === 'object') {
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
            const category = topologyData[lineIndex][0].toLowerCase();

            for (const varIndex of varIndices) {
                const varName = topologyData[lineIndex][varIndex].toLowerCase().replaceAll('"', '').trim();
                let varValue = topologyData[lineIndex][varIndex + 1].trim();

                if (varValue.includes('"')) {
                    varValue = varValue.replaceAll('"', '');
                } else {
                    varValue = varValue.includes('.') ? parseFloat(varValue) : parseInt(varValue);
                }
                this._topology[`${category}/${varName}`] = varValue;
            }
        }
    }
}
