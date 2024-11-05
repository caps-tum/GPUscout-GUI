<template>
    <div class="flex h-full w-full flex-col items-center justify-center">
        <p class="mb-20 text-9xl font-bold">GPUscout-GUI</p>
        <div class="flex w-full flex-row justify-center space-x-4 px-12">
            <div class="flex max-h-full w-full flex-col">
                <p class="mb-2 text-2xl font-bold">1. Select GPUscout result to analyze:</p>
                <SelectAnalysis ref="analysisSelector" @analysis-selected="onAnalysisSelected" />
                <p class="w-full py-1 text-center text-xl font-bold">OR</p>
                <AnalysesFromFolder
                    :gpuscout-output-folder="config['gpuscoutOutputFolder']"
                    @analysis-selected="onAnalysisSelected"
                    @folder-changed="folderChanged"
                />
                <p class="w-full py-1 text-xl font-bold">Select memory topology (optional)</p>
                <SelectMemoryTopology @topology-selected="onMT4GSelected" />
            </div>
            <div v-if="comparisonMode" class="flex max-h-full w-full flex-col">
                <p class="mb-2 text-2xl font-bold">2. Select GPUscout result to compare to:</p>
                <SelectAnalysis ref="comparisonAnalysisSelector" @analysis-selected="onComparisonAnalysisSelected" />
                <p class="w-full py-1 text-center text-xl font-bold">OR</p>
                <AnalysesFromFolder
                    :gpuscout-output-folder="config['gpuscoutOutputFolder']"
                    @analysis-selected="onComparisonAnalysisSelected"
                    @folder-changed="folderChanged"
                />
                <p class="w-full py-1 text-xl font-bold">Select memory topology (optional)</p>
                <SelectMemoryTopology @topology-selected="onCompatisonMT4GSelected" />
            </div>
            <div v-else class="flex max-h-full w-full flex-col items-center justify-center">
                <ButtonSecondary title="Add second GPUscout result to compare to" @click="comparisonMode = true">
                    <IconAdd class="h-20 w-full self-center" />
                </ButtonSecondary>
            </div>
        </div>
        <ButtonPrimary
            :disabled="selectedAnalysisPath === ''"
            title="Proceed"
            class="absolute bottom-2 right-2"
            @click="proceed"
        />
    </div>
</template>
<script setup>
import { computed } from 'vue';
import { useConfigStore } from '../../../stores/ConfigStore';
import AnalysesFromFolder from './analyses_from_folder/AnalysesFromFolder.vue';
import { ref } from 'vue';
import SelectAnalysis from './SelectAnalysis.vue';
import { useDataStore } from '../../../stores/DataStore';
import { useContextStore, CONTEXT } from '../../../stores/ContextStore';
import ButtonPrimary from '../../ui/buttons/ButtonPrimary.vue';
import ButtonSecondary from '../../ui/buttons/ButtonSecondary.vue';
import SelectMemoryTopology from './SelectMemoryTopology.vue';
import IconAdd from '../../ui/icons/IconAdd.vue';

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

async function folderChanged(directory) {
    configStore.setOption('gpuscoutOutputFolder', directory);
}

function onAnalysisSelected(analysisPath, isFile = false) {
    if (!isFile) {
        analysisSelector.value.clear();
    }
    selectedAnalysisPath.value = analysisPath;
}

function onComparisonAnalysisSelected(analysisPath, isFile = false) {
    if (!isFile) {
        comparisonAnalysisSelector.value.clear();
    }
    selectedComparisonAnalysisPath.value = analysisPath;
}

function onMT4GSelected(topologyPath) {
    selectedMT4GPath.value = topologyPath;
}

function onCompatisonMT4GSelected(topologyPath) {
    selectedComparisonMT4GPath.value = topologyPath;
}

async function proceed() {
    if (!selectedAnalysisPath.value) {
        alert('No analysis selected');
        return;
    }
    const analysisFileData = await window.electronAPI.loadFile(selectedAnalysisPath.value + '.gscout');
    const comparisonAnalysisFileData = selectedComparisonAnalysisPath.value
        ? await window.electronAPI.loadFile(selectedComparisonAnalysisPath.value + '.gscout')
        : undefined;
    const topologyData = selectedMT4GPath.value ? await window.electronAPI.loadFile(selectedMT4GPath.value) : undefined;
    const comparisonTopologyData = selectedComparisonMT4GPath.value
        ? await window.electronAPI.loadFile(selectedComparisonMT4GPath.value)
        : undefined;

    await dataStore.initialize(analysisFileData, comparisonAnalysisFileData, topologyData, comparisonTopologyData);
    contextStore.setCurrentContext(CONTEXT.ANALYSIS);
}
</script>
