import { defineStore } from 'pinia';

export const useDataStore = defineStore('data', () => {
    let analyses = {};
    /** @type {String[]} */
    const kernels = [];

    /** @type {Object.<String, {address: Number, tokens: String[]}[]>} */
    const sourceCodeLines = {};

    /** @type {Object.<String, Object.<String, {line: Number, file: String}>>} */
    const sassToSourceLines = {};
    /** @type {Object.<String, {address: String, tokens: String[]}[]>} */
    const sassCodeLines = {};

    /** @type {Object.<String, Object.<String, {line: Number, file: String}>>} */
    const ptxToSourceLines = {};
    /** @type {Object.<String, {address: Number, tokens: String[]}[]>} */
    const ptxCodeLines = {};

    const getSourceCodeLines = () => sourceCodeLines;
    const getAnalyses = () => analyses;
    const getSassToSourceLines = () => sassToSourceLines;
    const getPtxToSourceLines = () => ptxToSourceLines;
    const getSassCodeLines = () => sassCodeLines;
    const getPtxCodeLines = () => ptxCodeLines;
    const getKernels = () => kernels;

    /**
     * Initialize the store with the data from GPUscout
     * @param {Blob} analysisData The data of the "result.json" file
     * @param {Blob} sassCode The sass code file
     * @param {Blob} ptxCode The ptx code file
     * @param {File[]} sourceCode The source code files
     */
    async function initialize(analysisData, sassCode, ptxCode, sourceCode) {
        const analysisJSON = JSON.parse(await analysisData.text());

        analyses = analysisJSON['analyses'];
        const newToOldFilename = analysisJSON['source_files'];

        const sourceFileContents = {};
        for (const file of sourceCode) {
            let content = await file.text();

            sourceFileContents[newToOldFilename[file.webkitRelativePath.replace('tmp-gpuscout/', '')]] = content.split('\n');
        }

        parseSassCode(await sassCode.text());
        parsePtxCode(await ptxCode.text());

        aggregateKernelSourceCode(sourceFileContents);

        console.log(kernels);
        console.log(analyses);

        console.log('SASS');
        console.log(sassCodeLines);
        console.log(sassToSourceLines);

        console.log('PTX');
        console.log(ptxCodeLines);
        console.log(ptxToSourceLines);

        console.log('SOURCE');
        console.log(sourceCodeLines);
    }

    /**
     * Parse the ptx code and extract the mapping to the source code
     * @param {String} ptxCode The generated ptx source code
     */
    function parsePtxCode(ptxCode) {
        let currentSourceLine = -1;
        let currentKernel = '';
        let currentSourceFile = '';
        let currentPtxLine = 1;

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

                ptxToSourceLines[currentKernel] = {};
                ptxCodeLines[currentKernel] = [];
            } else if (line.startsWith('.loc')) {
                // .loc	1 3 0
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
                for (const kernel of Object.keys(ptxToSourceLines)) {
                    for (const line of Object.keys(ptxToSourceLines[kernel])) {
                        if (ptxToSourceLines[kernel][line]['file'] === fileIndex) {
                            ptxToSourceLines[kernel][line]['file'] = fileName;
                        }
                    }
                }
            } else if (line !== '') {
                // OPERATION PARAM1, PARAM2, ...;
                // OR
                // LABEL:
                const isLabel = line.endsWith(':');

                ptxToSourceLines[currentKernel][currentPtxLine] = {
                    line: currentSourceLine,
                    file: currentSourceFile
                };
                ptxCodeLines[currentKernel].push({
                    address: isLabel ? -1 : currentPtxLine,
                    tokens: line
                        .slice(0, -1)
                        .split(' ')
                        .filter((token) => token.length > 0)
                        .flatMap((token) => (token.endsWith(',') ? [token.slice(0, -1), ','] : token))
                        .concat(';')
                });

                if (!isLabel) currentPtxLine++;
            }
        }
    }

    /**
     * Parse the sass code and extract the mapping to the source code
     * @param {String} sassCode The generated sass source code
     */
    function parseSassCode(sassCode) {
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

                sassToSourceLines[currentKernel] = {};
                sassCodeLines[currentKernel] = [];
                kernels.push(currentKernel);
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
                }

                sassToSourceLines[currentKernel][currentSassLine] = {
                    line: currentSourceLine,
                    file: currentSourceFile
                };

                sassCodeLines[currentKernel].push({
                    address: address,
                    tokens: line
                        .trim()
                        .split(' ')
                        .filter((token) => token.length > 0)
                        .flatMap((token) => (token.endsWith(',') ? [token.slice(0, -1), ','] : token))
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
    function aggregateKernelSourceCode(sourceFileContents) {
        for (const kernel of kernels) {
            // Get relevant lines in all source files
            let relevantLines = Object.groupBy(
                Object.values(sassToSourceLines[kernel]).concat(Object.values(ptxToSourceLines[kernel])),
                ({ file }) => file
            );

            let lineNumber = 1;
            const oldToNewLineNumbers = {};

            for (let [sourceFile, lineNumbers] of Object.entries(relevantLines)) {
                // Get relevant line section in source file
                lineNumbers = lineNumbers.map((ln) => ln['line']);
                const minLine = Math.max(0, Math.min(...lineNumbers) - 1);
                const maxLine = Math.min(sourceFileContents[sourceFile].length, Math.max(...lineNumbers));

                // The new line numbers dont match the old ones, save the mapping
                oldToNewLineNumbers[sourceFile] = {};

                // Add lines
                sourceCodeLines[kernel] = [];
                for (let i = minLine; i <= maxLine; i++) {
                    oldToNewLineNumbers[sourceFile][i] = lineNumber;
                    sourceCodeLines[kernel].push({
                        address: lineNumber++,
                        tokens: sourceFileContents[sourceFile][i].split(' ')
                    });
                }
                sourceCodeLines[kernel].push({
                    address: lineNumber++,
                    tokens: []
                });
            }

            for (const key of Object.keys(sassToSourceLines[kernel])) {
                sassToSourceLines[kernel][key] =
                    oldToNewLineNumbers[sassToSourceLines[kernel][key]['file']][sassToSourceLines[kernel][key]['line']];
            }
            for (const key of Object.keys(ptxToSourceLines[kernel])) {
                ptxToSourceLines[kernel][key] =
                    oldToNewLineNumbers[ptxToSourceLines[kernel][key]['file']][ptxToSourceLines[kernel][key]['line']];
            }
        }
    }

    return {
        getSourceCodeLines,
        getAnalyses,
        getSassToSourceLines,
        getPtxToSourceLines,
        getPtxCodeLines,
        getSassCodeLines,
        getKernels,
        initialize
    };
});
