<!--
Component for the laning page, which allows selecting up to 2 analysis and topology result files.

Author: Tobias Stuckenberger
-->
<template>
    <div class="flex h-full w-full flex-col items-center">
        <p class="mb-4 text-8xl font-bold">GPUscout-GUI</p>
        <div class="flex w-full flex-row justify-center space-x-4 px-12">
            <div class="flex w-full flex-col">
                <p class="text-2xl font-bold">{{ TEXT.landing_page.select_result.title }}</p>
                <p class="-mt-1 text-text/50">{{ TEXT.landing_page.select_result.hint }}</p>
                <SelectAnalysis ref="analysisSelector" @analysis-selected="onAnalysisSelected" />
                <p class="w-full py-1 text-center text-xl font-bold">OR</p>
                <AnalysesFromFolder
                    :gpuscout-output-folder="config['gpuscoutOutputFolder']"
                    :selected-path="selectedAnalysisPath"
                    :show-folder-selector="true"
                    @analysis-selected="onAnalysisSelected"
                    @folder-changed="folderChanged"
                />
                <p class="mt-2 w-full text-xl font-bold">{{ TEXT.landing_page.select_topology_result.title }}</p>
                <p class="-mt-1 w-full text-text/50">{{ TEXT.landing_page.select_topology_result.hint }}</p>
                <SelectMemoryTopology @topology-selected="onMT4GSelected" />
            </div>
            <div v-if="comparisonMode" class="flex max-h-full w-full flex-col">
                <p class="text-2xl font-bold">{{ TEXT.landing_page.select_comparison_result.title }}</p>
                <p class="-mt-1 text-text/50">{{ TEXT.landing_page.select_comparison_result.hint }}</p>
                <SelectAnalysis ref="comparisonAnalysisSelector" @analysis-selected="onComparisonAnalysisSelected" />
                <p class="w-full py-1 text-center text-xl font-bold">OR</p>
                <AnalysesFromFolder
                    :gpuscout-output-folder="config['gpuscoutOutputFolder']"
                    :selected-path="selectedComparisonAnalysisPath"
                    @analysis-selected="onComparisonAnalysisSelected"
                    @folder-changed="folderChanged"
                />
                <p class="mt-2 w-full text-xl font-bold">{{ TEXT.landing_page.select_topology_result.title }}</p>
                <p class="-mt-1 w-full text-text/50">{{ TEXT.landing_page.select_topology_result.hint2 }}</p>
                <SelectMemoryTopology @topology-selected="onCompatisonMT4GSelected" />
            </div>
            <div v-else class="flex max-h-full w-full flex-col items-center justify-center">
                <ButtonSecondary title="Add second GPUscout result to compare to" @click="comparisonMode = true">
                    <IconAdd class="h-20 w-full self-center" />
                </ButtonSecondary>
            </div>
        </div>
        <div class="absolute bottom-2 right-2 flex flex-row items-center justify-center space-x-2 text-lg text-red-400">
            <p v-show="selectedAnalysisPath === ''">{{ TEXT.landing_page.error_messages.no_analysis }}</p>
            <p v-show="selectedAnalysisPath === selectedComparisonAnalysisPath && selectedAnalysisPath !== ''">
                {{ TEXT.landing_page.error_messages.duplicate_analysis }}
            </p>
            <ButtonPrimary
                :disabled="selectedAnalysisPath === '' || selectedAnalysisPath === selectedComparisonAnalysisPath"
                title="Proceed"
                @click="proceed"
            />
        </div>
    </div>
</template>
<script setup>
import { computed } from 'vue';
import { useConfigStore } from '../../../stores/ConfigStore';
import AnalysesFromFolder from './AnalysesFromFolder.vue';
import { ref } from 'vue';
import SelectAnalysis from './SelectAnalysis.vue';
import { useDataStore } from '../../../stores/DataStore';
import ButtonPrimary from '../../ui/buttons/ButtonPrimary.vue';
import ButtonSecondary from '../../ui/buttons/ButtonSecondary.vue';
import SelectMemoryTopology from './SelectMemoryTopology.vue';
import IconAdd from '../../ui/icons/IconAdd.vue';
import { TEXT } from '../../../../../config/text';
import { CONTEXT, useContextStore } from '../../../stores/ContextStore';

const configStore = useConfigStore();
const dataStore = useDataStore();
const contextStore = useContextStore();

const config = computed(() => configStore.getConfig);

const analysisSelector = ref(null);
const comparisonAnalysisSelector = ref(null);

const selectedAnalysisPath = ref('');
const selectedComparisonAnalysisPath = ref('');

const selectedMT4GPath = ref('');
const selectedComparisonMT4GPath = ref('');

const comparisonMode = ref(false);

/**
 * Called when the GPUscout output folder changed
 * @param {String} directory The chosen directory
 */
async function folderChanged(directory) {
    configStore.setOption('gpuscoutOutputFolder', directory);
    window.location.reload();
}

/**
 * Called when an analysis has been selected
 * @param {String} analysisPath The path of the chosen file
 * @param {Boolean} [isFile=false] If the file has been chosen manually and not from the list
 */
function onAnalysisSelected(analysisPath, isFile = false) {
    if (!isFile) {
        analysisSelector.value.clear();
    }
    selectedAnalysisPath.value = analysisPath;
}

/**
 * Called when a comparison analysis has been selected
 * @param {String} analysisPath The path of the chosen file
 * @param {Boolean} [isFile=false] If the file has been chosen manually and not from the list
 */
function onComparisonAnalysisSelected(analysisPath, isFile = false) {
    if (!isFile) {
        comparisonAnalysisSelector.value.clear();
    }
    selectedComparisonAnalysisPath.value = analysisPath;
}

/**
 * Called when a topology file has been selected
 * @param {String} topologyPath The path of the chosen file
 */
function onMT4GSelected(topologyPath) {
    selectedMT4GPath.value = topologyPath;
}

/**
 * Called when a comparison topology file has been selected
 * @param {String} topologyPath The path of the chosen file
 */
function onCompatisonMT4GSelected(topologyPath) {
    selectedComparisonMT4GPath.value = topologyPath;
}

/**
 * Proceed to the analysis screens
 */
async function proceed() {
    if (!selectedAnalysisPath.value) {
        alert('No analysis selected');
        return;
    }

    const analysisFileData = await window.electronAPI.loadFile(selectedAnalysisPath.value + '.json');
    const comparisonAnalysisFileData = selectedComparisonAnalysisPath.value
        ? await window.electronAPI.loadFile(selectedComparisonAnalysisPath.value + '.json')
        : undefined;
    const topologyData = selectedMT4GPath.value ? await window.electronAPI.loadFile(selectedMT4GPath.value) : undefined;
    const comparisonTopologyData = selectedComparisonMT4GPath.value
        ? await window.electronAPI.loadFile(selectedComparisonMT4GPath.value)
        : undefined;

    contextStore.setCurrentContext(CONTEXT.LOADING);
    setTimeout(async () => {
        await dataStore.initialize(analysisFileData, comparisonAnalysisFileData, topologyData, comparisonTopologyData);
    }, 100);
}
</script>
