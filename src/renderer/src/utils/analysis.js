export class Analysis {
    constructor(analysisData, sassCode, sassRegisters, ptxCode, sourceCodes) {
        const analysisJSON = JSON.parse(analysisData);

        this.analyses = analysisJSON['analyses'];
        this.kernels = [];
        this.sassCodeLines = {};
        this.sassToSourceLines = {};
        this.ptxCodeLines = {};
        this.ptxToSourceLines = {};
        this.sourceCodeLines = {};

        const newToOldFilename = analysisJSON['source_files'];

        const sourceFileContents = {};
        for (const [filePath, content] of Object.entries(sourceCodes)) {
            sourceFileContents[newToOldFilename[filePath]] = content.split('\n');
        }

        this._parseSassCode(sassCode);
        this._parsePtxCode(ptxCode);

        this._aggregateKernelSourceCode(sourceFileContents);
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

                this.ptxToSourceLines[currentKernel][currentPtxLine] = {
                    line: currentSourceLine,
                    file: currentSourceFile
                };
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

            console.log(relevantLines, sourceFileContents);

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
        }
    }
}
