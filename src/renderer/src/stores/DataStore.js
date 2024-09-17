import { defineStore } from 'pinia';
import { Analysis } from '../utils/analysis';

export const useDataStore = defineStore('data', () => {
    let analysis;
    /*/** @type {String[]}
    const kernels = [];

    /** @type {Object.<String, {address: Number, tokens: String[]}[]>}
    const sourceCodeLines = {};

    /** @type {Object.<String, Object.<String, Number>>}
    const sassToSourceLines = {};
    /** @type {Object.<String, {address: String, tokens: String[]}[]>}
    const sassCodeLines = {};

    /** @type {Object.<String, Object.<String, Number>>}
    const ptxToSourceLines = {};
    /** @type {Object.<String, {address: Number, tokens: String[]}[]>}
    const ptxCodeLines = {}; */

    const getSourceCodeLines = () => analysis.sourceCodeLines;
    const getAnalyses = () => analysis.analyses;
    const getSassToSourceLines = () => analysis.sassToSourceLines;
    const getPtxToSourceLines = () => analysis.ptxToSourceLines;
    const getSassCodeLines = () => analysis.sassCodeLines;
    const getPtxCodeLines = () => analysis.ptxCodeLines;
    const getKernels = () => analysis.kernels;

    /**
     * Initialize the store with the data from GPUscout
     * @param {String} analysisData The data of the "result.json" file
     * @param {String} sassCode The sass code file
     * @param {String} sassRegisters The sass registers file
     * @param {String} ptxCode The ptx code file
     * @param {Object.<String, String>} sourceCodes The source code files
     */
    async function initialize(analysisData, sassCode, sassRegisters, ptxCode, sourceCodes) {
        analysis = new Analysis(analysisData, sassCode, sassRegisters, ptxCode, sourceCodes);

        console.log(analysis.kernels);
        console.log(analysis.analyses);

        console.log('SASS');
        console.log(analysis.sassCodeLines);
        console.log(analysis.sassToSourceLines);

        console.log('PTX');
        console.log(analysis.ptxCodeLines);
        console.log(analysis.ptxToSourceLines);

        console.log('SOURCE');
        console.log(analysis.sourceCodeLines);
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
