<template>
    <div class="flex h-full w-full flex-col items-center justify-center">
        <p class="mb-20 text-9xl font-bold">GPUscout-GUI</p>
        <div class="flex w-full flex-row justify-center space-x-4 px-12">
            <div class="flex max-h-full w-full flex-col">
                <SelectAnalysis @analysis-selected="onAnalysisSelected" />
                <p class="w-full py-1 text-center text-xl font-bold">OR</p>
                <AnalysesFromFolder
                    :gpuscout-output-folder="config['gpuscoutOutputFolder']"
                    @analysis-selected="onAnalysisSelected"
                    @folder-changed="folderChanged"
                />
            </div>
            <div class="flex max-h-full w-full flex-col">
                <SelectAnalysis @analysis-selected="onComparisonAnalysisSelected" />
                <p class="w-full py-1 text-center text-xl font-bold">OR</p>
                <AnalysesFromFolder
                    :gpuscout-output-folder="config['gpuscoutOutputFolder']"
                    @analysis-selected="onComparisonAnalysisSelected"
                    @folder-changed="folderChanged"
                />
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

const configStore = useConfigStore();
const dataStore = useDataStore();
const contextStore = useContextStore();

const config = computed(() => configStore.getConfig);

const selectedAnalysisPath = ref('');
const selectedComparisonAnalysisPath = ref('');

async function folderChanged(directory) {
    configStore.setOption('gpuscoutOutputFolder', directory);
}

function onAnalysisSelected(analysisPath) {
    selectedAnalysisPath.value = analysisPath;
}

function onComparisonAnalysisSelected(analysisPath) {
    selectedComparisonAnalysisPath.value = analysisPath;
}

async function proceed() {
    if (!selectedAnalysisPath.value) {
        alert('No analysis selected');
        return;
    }
    const analysisFileData = await window.electronAPI.loadAnalysis(selectedAnalysisPath.value);
    const comparisonAnalysisFileData = selectedComparisonAnalysisPath.value
        ? await window.electronAPI.loadAnalysis(selectedComparisonAnalysisPath.value)
        : undefined;

    await dataStore.initialize(analysisFileData, comparisonAnalysisFileData);
    contextStore.setCurrentContext(CONTEXT.ANALYSIS);
}
</script>
