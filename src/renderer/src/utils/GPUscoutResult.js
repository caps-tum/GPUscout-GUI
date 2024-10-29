import { ANALYSIS } from '../../../config/analyses';
import { CODE_TYPE } from '../stores/CodeViewerStore';
import { Analysis } from './Analysis';
import { Topology } from './Topology';

export class GPUscoutResult {
    constructor(resultData, topologyData) {
        const resultJSON = JSON.parse(resultData);

        this.gpuTopology = new Topology(topologyData);
        this.analyses = {};
        this.kernels = [];
        this.sassCodeLines = {};
        this.sassToSourceLines = {};
        this.ptxCodeLines = {};
        this.ptxToSourceLines = {};
        this.sourceCodeLines = {};
        this.sourceToSassLines = {};
        this.sourceToPtxLines = {};

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

        for (const [analysisName, analysisDefinition] of Object.entries(ANALYSIS)) {
            this.analyses[analysisName] = {};

            if (!resultJSON['analyses'][analysisDefinition.name]) continue;

            for (let [kernel, analysisData] of Object.entries(resultJSON['analyses'][analysisDefinition.name])) {
                kernel = resultJSON['kernels'][kernel];
                this.analyses[analysisName][kernel] = new Analysis(
                    analysisData,
                    kernel,
                    analysisDefinition.occurrence_constructor
                );
            }
        }
    }

    /**
     * @param analysis The name of the analysis
     * @param kernel The name of the kernel
     * @returns {Analysis}
     */
    getAnalysis(analysis, kernel) {
        if (!this.analyses[analysis] || !this.analyses[analysis][kernel]) return undefined;
        return this.analyses[analysis][kernel];
    }

    /**
     * @param {String} kernel
     * @returns {String[]}
     */
    getAnalysesWithOccurrences(kernel) {
        return Object.keys(this.analyses).filter(
            (analysis) =>
                Object.entries(this.analyses[analysis]).filter(([k, a]) => kernel === k && a.getOccurrences().length > 0)
                    .length > 0
        );
    }

    /**
     * TODO: handle branch entry that is multiline
     * @param {String} kernel
     * @param {String} codeType
     * @param {String|Number} lineNumber
     * @returns {String[]}
     */
    getInstructionTokens(kernel, codeType, lineNumber) {
        if (codeType === CODE_TYPE.SASS_CODE) {
            let tokens = this.sassCodeLines[kernel].find((line) => line.address === lineNumber).tokens;
            if (tokens.length > 0 && tokens[0] === '{') {
                tokens = tokens.filter((_, i) => i >= tokens.findIndex((t) => t !== ' ' && t !== '{'));
            } else if (tokens.length > 0 && tokens[0].startsWith('@')) {
                tokens = tokens.filter((_, i) => i > 1);
            }
            let index = tokens.findIndex((t) => t === ' ');
            return tokens.filter((tok, i) => tok !== '.' && i < (index > 0 ? index : tokens.length));
        } else {
            let tokens = this.ptxCodeLines[kernel].find((line) => line.address === lineNumber).tokens;
            if (tokens.length > 0 && tokens[0].startsWith('@')) {
                tokens = tokens.filter((_, i) => i > 1);
            }
            let index = tokens.findIndex((t) => t === ' ');
            return tokens.filter((tok, i) => tok !== '.' && i < (index > 0 ? index : tokens.length));
        }
    }

    getLineStalls(kernel, line, codeType) {
        if (codeType === CODE_TYPE.SASS_CODE) {
            return this.sassCodeLines[kernel].find((l) => l.address === line)?.stalls || [];
        } else {
            return this.sourceCodeLines[kernel].find((l) => l.address === line)?.stalls || [];
        }
    }

    /**
     * @param {String} kernel The name of the kernel
     * @param {String} line The line to get source lines for
     * @returns {Number}
     */
    getSassToSourceLine(kernel, line) {
        return this.sassToSourceLines[kernel][line];
    }

    /**
     * @param {String} kernel The name of the kernel
     * @param {String} line The line to get source lines for
     * @returns {String}
     */
    getPtxToSourceLine(kernel, line) {
        return this.ptxToSourceLines[kernel][line];
    }

    /**
     * @param {String} kernel The name of the kernel
     * @returns {{address: String, tokens: String[]}[]}
     */
    getSassCodeLines(kernel) {
        return this.sassCodeLines[kernel];
    }

    /**
     * @param {String} kernel The name of the kernel
     * @returns {{address: Number, tokens: String[]}[]}
     */
    getPtxCodeLines(kernel) {
        return this.ptxCodeLines[kernel];
    }

    /**
     * @param {String} kernel The name of the kernel
     * @returns {{address: Number, tokens: String[]}[]}
     */
    getSourceCodeLines(kernel) {
        return this.sourceCodeLines[kernel];
    }

    /**
     * @param {String} kernel The name of the kernel
     * @param {String} line The line to get sass lines for
     * @returns {String[]}
     */
    getSourceToSassLines(kernel, line) {
        return this.sourceToSassLines[kernel][line] || [];
    }

    /**
     * @param {String} kernel The name of the kernel
     * @param {String} line The line to get ptx lines for
     * @returns {Number[]}
     */
    getSourceToPtxLines(kernel, line) {
        return this.sourceToPtxLines[kernel][line] || [];
    }

    /**
     * Parse the ptx code and extract the mapping to the source code
     * @param {String} ptxCode The generated ptx source code
     * @param {Object.<String, String>} kernels
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

                this.ptxToSourceLines[currentKernel] = {};
                this.ptxCodeLines[currentKernel] = [];

                this.ptxCodeLines[currentKernel].push({
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
                for (const kernel of Object.keys(this.ptxToSourceLines)) {
                    for (const line of Object.keys(this.ptxToSourceLines[kernel])) {
                        if (this.ptxToSourceLines[kernel][line]['file'] === fileIndex) {
                            this.ptxToSourceLines[kernel][line]['file'] = fileName;
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
                    this.ptxToSourceLines[currentKernel][currentPtxLine] = {
                        line: currentSourceLine,
                        file: currentSourceFile
                    };
                }
                if (isLabel) {
                    lastLineBranch = line.substring(0, line.length - 1);
                } else if (lastLineBranch !== '') {
                    this.ptxCodeLines[currentKernel].find(
                        (line) => line.tokens.includes(lastLineBranch) && line.address === -1
                    ).address = currentPtxLine;
                    lastLineBranch = '';
                }
                this.ptxCodeLines[currentKernel].push({
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
     * @param {Object.<String, String>} kernels
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

                this.sassToSourceLines[currentKernel] = {};
                this.sassCodeLines[currentKernel] = [];
                this.kernels.push(currentKernel);

                this.sassCodeLines[currentKernel].push({
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

                    this.sassToSourceLines[currentKernel][currentSassLine] = {
                        line: currentSourceLine,
                        file: currentSourceFile
                    };
                    if (lastLineBranch !== '') {
                        this.sassCodeLines[currentKernel].find((lines) => lines.address === lastLineBranch).address =
                            address;
                        lastLineBranch = '';
                    }

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

                const lineStalls = Object.fromEntries(
                    relevantStalls.filter((s) => s['pc_offset'].padStart(4, '0') === address).flatMap((s) => s['stalls'])
                );
                if (Object.keys(lineStalls).length > 0) {
                    lineStalls['total'] = totalStalls;
                }
                this.sassCodeLines[currentKernel].push({
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
        for (const kernel of this.kernels) {
            // Get relevant lines in all source files
            let relevantLines = Object.groupBy(
                Object.values(this.sassToSourceLines[kernel]).concat(Object.values(this.ptxToSourceLines[kernel])),
                ({ file }) => file
            );
            let relevantStalls = stalls[kernel] || [];
            let totalStalls = relevantStalls.flatMap((s) => s['stalls'].map((st) => st[1])).reduce((a, b) => a + b, 0);

            let lineNumber = 1;
            const oldToNewLineNumbers = {};

            this.sourceCodeLines[kernel] = [];

            for (let [sourceFile, lineNumbers] of Object.entries(relevantLines)) {
                // Get relevant line section in source file
                lineNumbers = lineNumbers.map((ln) => ln['line']);
                const minLine = 1;
                const maxLine = sourceFileContents[sourceFile].length;

                // The new line numbers dont match the old ones, save the mapping
                oldToNewLineNumbers[sourceFile] = {};

                // Add lines
                for (let i = minLine; i <= maxLine; i++) {
                    oldToNewLineNumbers[sourceFile][i] = lineNumber;
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
                    this.sourceCodeLines[kernel].push({
                        address: lineNumber,
                        tokens: sourceFileContents[sourceFile][i - 1].split(/([ ,(){};+\-*<>=%&./])/),
                        stalls: lineStalls
                    });
                    lineNumber++;
                }
                this.sourceCodeLines[kernel].push({
                    address: lineNumber,
                    tokens: [],
                    stalls: {}
                });
                lineNumber++;
            }

            for (const key of Object.keys(this.sassToSourceLines[kernel])) {
                this.sassToSourceLines[kernel][key] =
                    oldToNewLineNumbers[this.sassToSourceLines[kernel][key]['file']][
                        this.sassToSourceLines[kernel][key]['line']
                    ];
            }
            for (const key of Object.keys(this.ptxToSourceLines[kernel])) {
                this.ptxToSourceLines[kernel][key] =
                    oldToNewLineNumbers[this.ptxToSourceLines[kernel][key]['file']][
                        this.ptxToSourceLines[kernel][key]['line']
                    ];
            }
            this.sourceToSassLines[kernel] = {};
            for (const key of [...new Set(Object.values(this.sassToSourceLines[kernel]))]) {
                this.sourceToSassLines[kernel][key] = Object.entries(this.sassToSourceLines[kernel])
                    .filter(([, v]) => v === parseInt(key))
                    .map(([k]) => k);
            }
            this.sourceToPtxLines[kernel] = {};
            for (const key of [...new Set(Object.values(this.ptxToSourceLines[kernel]))]) {
                this.sourceToPtxLines[kernel][key] = Object.entries(this.ptxToSourceLines[kernel])
                    .filter(([, v]) => v === parseInt(key))
                    .map(([k]) => parseInt(k));
            }
        }
    }
}
