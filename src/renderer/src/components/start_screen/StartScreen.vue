<template>
    <div class="flex h-full w-full flex-col items-center justify-center">
        <div class="flex flex-row space-x-1">
            <label>GPUScout output directory:</label>
            <input
                :value="config['gpuscoutOutputFolder']"
                type="text"
                class="bg-red-400"
                @change="changeGPUScoutOutputFolder"
            />
            <button @click="selectFolder">Choose Folder</button>
        </div>
        <div class="w-1/2">
            <SelectAnalysis @analysis-selected="onAnalysisSelected" />
            <p class="w-full py-1 text-center text-xl font-bold">OR</p>
            <AnalysesFromFolder :files="filesInOutputFolder" />
            <p class="w-full py-1 text-center text-xl font-bold">OR</p>
            <RecentAnalyses />
        </div>
        <button class="absolute bottom-2 right-2 h-12 w-32 rounded bg-green-400" @click="proceed">Proceed</button>
    </div>
</template>
<script setup>
import { computed, onMounted } from 'vue';
import RecentAnalyses from './recent_analyses/RecentAnalyses.vue';
import { useConfigStore } from '../../stores/ConfigStore';
import AnalysesFromFolder from './analyses_from_folder/AnalysesFromFolder.vue';
import { ref } from 'vue';
import SelectAnalysis from './SelectAnalysis.vue';
import { useDataStore } from '../../stores/DataStore';
import { useContextStore, CONTEXT } from '../../stores/ContextStore';

const configStore = useConfigStore();
const dataStore = useDataStore();
const contextStore = useContextStore();

const config = computed(() => configStore.getConfig);

const filesInOutputFolder = ref([]);
const selectedAnalysisTitle = ref('');
const selectedAnalysisFolder = ref('');

onMounted(async () => {
    await updateRelevantFiles();
});

async function changeGPUScoutOutputFolder(event) {
    configStore.setOption('gpuscoutOutputFolder', event.target.value);
    await updateRelevantFiles();
}

async function selectFolder() {
    const selectedDirectory = await window.electronAPI.selectDirectory(config.value['gpuscoutOutputFolder']);

    if (selectedDirectory.length > 0) {
        configStore.setOption('gpuscoutOutputFolder', selectedDirectory);
        await updateRelevantFiles();
    }
}

async function updateRelevantFiles() {
    filesInOutputFolder.value = await window.electronAPI.readDirectory(config.value['gpuscoutOutputFolder']);
}

function onAnalysisSelected(folderPath, title) {
    selectedAnalysisTitle.value = title;
    selectedAnalysisFolder.value = folderPath;
}

async function proceed() {
    if (!selectedAnalysisFolder.value || !selectedAnalysisTitle.value) {
        alert('No analysis selected');
    }
    const analysisFileData = await window.electronAPI.loadAnalysis(
        selectedAnalysisFolder.value,
        selectedAnalysisTitle.value
    );
    await dataStore.initialize(...analysisFileData);
    contextStore.setCurrentContext(CONTEXT.CODE_VIEW);
}
</script>
