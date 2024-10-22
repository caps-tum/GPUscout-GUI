<template>
    <div class="flex h-full w-full flex-col items-center justify-center">
        <p class="mb-20 text-9xl font-bold">GPUscout-GUI</p>
        <div class="flex max-h-full w-1/2 flex-col">
            <div class="flex flex-row space-x-1"></div>
            <SelectAnalysis
                :contains-selected-analysis="selectedAnalysisSource === 'FILE'"
                @analysis-selected="onAnalysisSelected"
            />
            <p class="w-full py-1 text-center text-xl font-bold">OR</p>
            <AnalysesFromFolder
                :files="filesInOutputFolder"
                :contains-selected-analysis="selectedAnalysisSource === 'FOLDER'"
                :gpuscout-output-folder="config['gpuscoutOutputFolder']"
                @analysis-selected="onAnalysisSelected"
                @folder-changed="folderChanged"
            />
            <!--<p class="w-full py-1 text-center text-xl font-bold">OR</p>
            <RecentAnalyses />-->
        </div>
        <ButtonPrimary
            :disabled="selectedAnalysisTitle === ''"
            title="Proceed"
            class="absolute bottom-2 right-2"
            @click="proceed"
        />
    </div>
</template>
<script setup>
import { computed, onMounted } from 'vue';
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

const filesInOutputFolder = ref([]);
const selectedAnalysisTitle = ref('');
const selectedAnalysisFolder = ref('');
const selectedAnalysisSource = ref('');

onMounted(async () => {
    await updateRelevantFiles();
});

async function folderChanged(directory) {
    configStore.setOption('gpuscoutOutputFolder', directory);
    await updateRelevantFiles();
}

async function updateRelevantFiles() {
    filesInOutputFolder.value = await window.electronAPI.getAnalysesInDirectory(config.value['gpuscoutOutputFolder']);
}

function onAnalysisSelected(folderPath, title, source) {
    selectedAnalysisSource.value = source;
    selectedAnalysisTitle.value = title;
    selectedAnalysisFolder.value = folderPath || config.value['gpuscoutOutputFolder'];
}

async function proceed() {
    if (!selectedAnalysisFolder.value || !selectedAnalysisTitle.value) {
        alert('No analysis selected');
        return;
    }
    const analysisFileData = await window.electronAPI.loadAnalysis(
        selectedAnalysisFolder.value,
        selectedAnalysisTitle.value
    );
    await dataStore.initialize(analysisFileData);
    contextStore.setCurrentContext(CONTEXT.ANALYSIS);
}
</script>
