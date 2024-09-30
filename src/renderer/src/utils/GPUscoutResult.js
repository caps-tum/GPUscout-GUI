import { DatatypeConversionAnalysis } from './analysisTypes/DatatypeConversionAnalysis';
import { DeadlockDetectionAnalysis } from './analysisTypes/DeadlockDetectionAnalysis';
import { GlobalAtomicsAnalysis } from './analysisTypes/GlobalAtomicsAnalysis';
import { RegisterSpillingAnalysis } from './analysisTypes/RegisterSpillingAnalysis';
import { UseRestrictAnalysis } from './analysisTypes/UseRestrictAnalysis';
import { UseSharedAnalysis } from './analysisTypes/UseSharedAnalysis';
import { UseTextureAnalysis } from './analysisTypes/UseTextureAnalysis';
import { VectorizationAnalysis } from './analysisTypes/VectorizationAnalysis';
import { WarpDivergenceAnalysis } from './analysisTypes/WarpDivergenceAnalysis';
import { Analysis } from './Analysis';

export const ANALYSES = {
    DATATYPE_CONVERSION: 'DATATYPE_CONVERSION',
    DEADLOCK_DETECTION: 'DEADLOCK_DETECTION',
    GLOBAL_ATOMICS: 'GLOBAL_ATOMICS',
    REGISTER_SPILLING: 'REGISTER_SPILLING',
    USE_RESTRICT: 'USE_RESTRICT',
    USE_SHARED: 'USE_SHARED',
    USE_TEXTURE: 'USE_TEXTURE',
    VECTORIZATION: 'VECTORIZATION',
    WARP_DIVERGENCE: 'WARP_DIVERGENCE'
};

const ANALYSIS_CONSTRUCTORS = {
    DATATYPE_CONVERSION: [
        'datatype_conversion',
        (analysisData, kernel) => new DatatypeConversionAnalysis(analysisData, kernel)
    ],
    DEADLOCK_DETECTION: [
        'deadlock_detection',
        (analysisData, kernel) => new DeadlockDetectionAnalysis(analysisData, kernel)
    ],
    GLOBAL_ATOMICS: ['global_atomics', (analysisData, kernel) => new GlobalAtomicsAnalysis(analysisData, kernel)],
    REGISTER_SPILLING: ['register_spilling', (analysisData, kernel) => new RegisterSpillingAnalysis(analysisData, kernel)],
    USE_RESTRICT: ['use_restrict', (analysisData, kernel) => new UseRestrictAnalysis(analysisData, kernel)],
    USE_SHARED: ['use_shared', (analysisData, kernel) => new UseSharedAnalysis(analysisData, kernel)],
    USE_TEXTURE: ['use_texture', (analysisData, kernel) => new UseTextureAnalysis(analysisData, kernel)],
    VECTORIZATION: ['vectorization', (analysisData, kernel) => new VectorizationAnalysis(analysisData, kernel)],
    WARP_DIVERGENCE: ['warp_divergence', (analysisData, kernel) => new WarpDivergenceAnalysis(analysisData, kernel)]
};

export class GPUscoutResult {
    constructor(resultData, sassCode, sassRegisters, ptxCode, sourceCodes) {
        const resultJSON = JSON.parse(resultData);

        this.analyses = {};
        this.kernels = [];
        this.sassCodeLines = {};
        this.sassToSourceLines = {};
        this.ptxCodeLines = {};
        this.ptxToSourceLines = {};
        this.sourceCodeLines = {};
        this.sourceToSassLines = {};
        this.sourceToPtxLines = {};

        const newToOldFilename = resultJSON['source_files'];

        const sourceFileContents = {};
        for (const [filePath, content] of Object.entries(sourceCodes)) {
            sourceFileContents[newToOldFilename[filePath]] = content.split('\n');
        }

        this._parseSassCode(sassCode);
        this._parsePtxCode(ptxCode);

        this._aggregateKernelSourceCode(sourceFileContents);

        for (const [analysisName, [jsonAnalysisName, analysisConstructor]] of Object.entries(ANALYSIS_CONSTRUCTORS)) {
            this.analyses[analysisName] = {};

            if (!resultJSON['analyses'][jsonAnalysisName]) continue;

            for (const [kernel, analysisData] of Object.entries(resultJSON['analyses'][jsonAnalysisName])) {
                this.analyses[analysisName][kernel] = analysisConstructor(analysisData, kernel);
            }
        }
    }

    /**
     * @param analysis The name of the analysis
     * @param kernel The name of the kernel
     * @returns {Analysis}
     */
    getAnalysis(analysis, kernel) {
        return this.analyses[analysis][kernel];
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
     */
    _parsePtxCode(ptxCode) {
        let currentSourceLine = -1;
        let currentKernel = '';
        let currentSourceFile = '';
        let currentPtxLine = 1;
        let isInFileDefinitions = false;

        for (const line of ptxCode.split('\n')) {
            if (currentSourceLine === -1 && !line.startsWith('.loc') && !line.includes('.visible')) {
                // Skip to first kernel
                continue;
            }
            if (line.includes('.visible')) {
                // .visible .entry KERNEL_NAME(
                currentSourceLine = -1;
                currentPtxLine = 1;
                currentKernel = line.split(' ').at(-1).replace('(', '');

                this.ptxToSourceLines[currentKernel] = {};
                this.ptxCodeLines[currentKernel] = [];
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
            } else if (line !== '') {
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
                this.ptxCodeLines[currentKernel].push({
                    address: isLabel ? -1 : currentPtxLine,
                    tokens: line
                        .slice(0, -1)
                        .split(/([, ;.])/)
                        .filter((token) => token.length > 0)
                });

                if (!isLabel) currentPtxLine++;
            }
        }
    }

    /**
     * Parse the sass code and extract the mapping to the source code
     * @param {String} sassCode The generated sass source code
     */
    _parseSassCode(sassCode) {
        let currentSourceLine = -1;
        let currentKernel = '';
        let currentSourceFile = '';
        let currentSassLine = '';

        for (let line of sassCode.split('\n')) {
            if (currentSourceLine === -1 && !line.startsWith('.text')) {
                // Skip to the first text section
                continue;
            }
            if (line.startsWith('.text')) {
                // .text.KERNEL_NAME:
                currentSourceLine = 0;
                currentSassLine = '';
                currentKernel = line.replace('.text.', '').replace(':', '');

                this.sassToSourceLines[currentKernel] = {};
                this.sassCodeLines[currentKernel] = [];
                this.kernels.push(currentKernel);
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
                if (line.includes('/*')) {
                    address = line.substring(line.indexOf('/*') + 2, line.indexOf('*/'));
                    line = line.replace(/\/\*.*\*\//, '');
                    currentSassLine = address;

                    this.sassToSourceLines[currentKernel][currentSassLine] = {
                        line: currentSourceLine,
                        file: currentSourceFile
                    };
                } else if (line.endsWith(':')) {
                    address = line.substring(0, line.length - 1);
                }

                this.sassCodeLines[currentKernel].push({
                    address: address,
                    tokens: line
                        .trim()
                        .split(/([,.[\]() ])/)
                        .filter((token) => token.length > 0)
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
     */
    _aggregateKernelSourceCode(sourceFileContents) {
        for (const kernel of this.kernels) {
            // Get relevant lines in all source files
            let relevantLines = Object.groupBy(
                Object.values(this.sassToSourceLines[kernel]).concat(Object.values(this.ptxToSourceLines[kernel])),
                ({ file }) => file
            );

            let lineNumber = 1;
            const oldToNewLineNumbers = {};

            this.sourceCodeLines[kernel] = [];

            for (let [sourceFile, lineNumbers] of Object.entries(relevantLines)) {
                // Get relevant line section in source file
                lineNumbers = lineNumbers.map((ln) => ln['line']);
                const minLine = Math.max(1, Math.min(...lineNumbers) - 1);
                const maxLine = Math.min(sourceFileContents[sourceFile].length, Math.max(...lineNumbers));

                // The new line numbers dont match the old ones, save the mapping
                oldToNewLineNumbers[sourceFile] = {};

                // Add lines
                for (let i = minLine; i <= maxLine; i++) {
                    oldToNewLineNumbers[sourceFile][i] = lineNumber;
                    this.sourceCodeLines[kernel].push({
                        address: lineNumber++,
                        tokens: sourceFileContents[sourceFile][i - 1].split(/([ ,(){};+\-*<>=%&./])/)
                    });
                }
                this.sourceCodeLines[kernel].push({
                    address: lineNumber++,
                    tokens: []
                });
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
