import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useDataStore = defineStore('data', () => {
    const analyses = ref({});
    const kernels = ref([]);

    const sourceCodeLines = ref({});

    const sassToSourceLines = ref({});
    const sassCodeLines = ref({});

    const ptxToSourceLines = ref({});
    const ptxCodeLines = ref({});

    const getSourceCodeLines = computed(() => sourceCodeLines.value);
    const getAnalyses = computed(() => analyses.value);
    const getSassToSourceLines = computed(() => sassToSourceLines.value);
    const getPtxToSourceLines = computed(() => ptxToSourceLines.value);
    const getSassCodeLines = computed(() => sassCodeLines.value);
    const getPtxCodeLines = computed(() => ptxCodeLines.value);
    const getKernels = computed(() => kernels.value);

    /**
     * Initialize the store with the data from GPUscout
     * @param {Blob} analysisData The data of the "result.json" file
     * @param {Blob} sassCode The sass code file
     * @param {Blob} ptxCode The ptx code file
     * @param {Blob[]} sourceCode The source code files
     */
    async function initialize(analysisData, sassCode, ptxCode, sourceCode) {
        const analysisJSON = JSON.parse(await analysisData.text());

        analyses.value = analysisJSON['analyses'];
        //const oldToNewFilename = analysisJSON['source_files'];

        for (const file of sourceCode) {
            let content = await file.text();

            sourceCodeLines.value[file.webkitRelativePath.replace('tmp-gpuscout/', '')] =
                content.split('\n');
        }

        parseSassCode(await sassCode.text());
        parsePtxCode(await ptxCode.text());
    }

    function parsePtxCode(ptxCode) {
        let currentSourceLine = -1;
        let currentKernel = '';
        let currentSourceFile = '';
        let currentPtxLine = 1;

        for (const line of ptxCode.split('\n')) {
            if (
                currentSourceLine === -1 &&
                !line.startsWith('.loc') &&
                !line.includes('.visible')
            ) {
                continue;
            }
            if (line.includes('.visible')) {
                currentSourceLine = -1;
                currentPtxLine = 1;
                currentKernel = line.split(' ').at(-1).replace('(', '');
                ptxToSourceLines.value[currentKernel] = {};
                ptxCodeLines.value[currentKernel] = [];
            } else if (line.startsWith('.loc')) {
                if (currentSourceLine === -1) {
                    currentSourceLine = 0;
                }
                const sourceLine = line.split(' ').at(-2);
                const file = line.split(' ').at(-3);

                currentSourceLine = sourceLine;
                currentSourceFile = file;
            } else if (line !== '') {
                ptxToSourceLines.value[currentKernel][currentPtxLine] = {
                    line: currentSourceLine,
                    file: currentSourceFile
                };
                ptxCodeLines.value[currentKernel].push(line);
                currentPtxLine++;
            } else if (line.startsWith('.file')) {
                const fileIndex = line.split(' ').at(-2);
                const fileName = line.split(' ').at(-1);
                for (const kernel of Object.keys(ptxToSourceLines.value)) {
                    for (const line of Object.keys(ptxToSourceLines.value[kernel])) {
                        if (ptxToSourceLines.value[kernel][line]['file'] === fileIndex) {
                            ptxToSourceLines.value[kernel][line]['file'] = fileName;
                        }
                    }
                }
            }
        }
    }

    function parseSassCode(sassCode) {
        let currentSourceLine = -1;
        let currentKernel = '';
        let currentSourceFile = '';
        let currentSassLine = 1;

        for (const line of sassCode.split('\n')) {
            if (currentSourceLine === -1 && !line.startsWith('.text')) {
                continue;
            }
            if (line.startsWith('.text')) {
                currentSourceLine = 0;
                currentSassLine = 1;
                currentKernel = line.replace('.text.', '').replace(':', '');
                sassToSourceLines.value[currentKernel] = {};
                sassCodeLines.value[currentKernel] = [];
                kernels.value.push(currentKernel);
            } else if (line.includes('//##')) {
                const sourceLine = line.split(' ').at(-1);
                const file = line.substring(line.indexOf('"') + 1, line.lastIndexOf('"'));

                currentSourceLine = sourceLine;
                currentSourceFile = file;
            } else if (line !== '') {
                sassToSourceLines.value[currentKernel][currentSassLine] = {
                    line: currentSourceLine,
                    file: currentSourceFile
                };
                sassCodeLines.value[currentKernel].push(line);
                currentSassLine++;
            } else {
                currentSourceLine = -1;
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
