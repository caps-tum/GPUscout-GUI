<template>
    <div class="rounded bg-secondary/50 p-4 text-text">
        <p class="-mb-2 text-lg">Select analysis in GPUscout output directory</p>
        <p class="text-sm">This list contains all GPUscout reseult files found in the selected output folder</p>
        <div class="my-1 flex flex-row justify-between">
            <TextInput v-model="searchString" placeholder="Search..." />
            <div class="flex flex-row space-x-1">
                <TextInput
                    ref="outputDirFolder"
                    placeholder="GPUscout output directory"
                    :readonly="true"
                    :value="gpuscoutOutputFolder"
                />
                <ButtonSecondary title="Choose Folder" class="!p-1 !text-base" @click="chooseFolder" />
            </div>
        </div>
        <div class="flex max-h-[25vh] flex-col space-y-1 overflow-y-auto">
            <ButtonSecondary
                v-for="title in getTitles()"
                :key="title"
                :title="title"
                :class="getSelectedStyle(title)"
                @click="() => onAnalysisSelected(title)"
            />
        </div>
    </div>
</template>
<script setup>
import TextInput from '../../../ui/input/TextInput.vue';
import { onMounted, ref } from 'vue';
import ButtonSecondary from '../../../ui/buttons/ButtonSecondary.vue';

const props = defineProps({
    gpuscoutOutputFolder: String
});

const emit = defineEmits(['analysisSelected', 'folderChanged']);

const searchString = ref('');
const selectedAnalysis = ref('');
const outputDirFolder = ref(null);
const files = ref([]);

onMounted(async () => {
    await getFilesInFolder();
});

/**
 * @returns {String[]} The titles of all available analyses matching the search string
 */
function getTitles() {
    return files.value.filter((file) => file.toLowerCase().includes(searchString.value.toLowerCase()));
}

/**
 * Called when an analysis has been selected
 * @param {String} analysisTitle The title of the selected analysis
 */
function onAnalysisSelected(analysisTitle) {
    selectedAnalysis.value = analysisTitle;
    emit('analysisSelected', props.gpuscoutOutputFolder + '/' + analysisTitle);
}

/**
 * @param {String} title The title of the analysis
 * @returns {String} The button style depending on if this analysis has been selected
 */
function getSelectedStyle(title) {
    return selectedAnalysis.value === title ? '!bg-primary !text-background' : '';
}

/**
 * Opens the folder picker to choose the gpuscout output folder
 */
async function chooseFolder() {
    const selectedDirectory = await window.electronAPI.selectDirectory(props.gpuscoutOutputFolder);

    if (selectedDirectory.length > 0) {
        emit('folderChanged', selectedDirectory);
        await getFilesInFolder();
    }
}

/**
 * Fetch all files that are inside the gpuscout output folder
 */
async function getFilesInFolder() {
    files.value = await window.electronAPI.getAnalysesInDirectory(props.gpuscoutOutputFolder);
}
</script>
