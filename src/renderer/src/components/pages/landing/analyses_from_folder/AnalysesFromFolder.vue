<template>
    <div class="rounded bg-secondary/50 p-4 text-text">
        <p class="-mb-2 text-lg">Available analyses in GPUscout output directory</p>
        <p class="text-sm">This list contains all GPUscout reseult files found in the selected output folder</p>
        <div class="my-1 flex flex-row justify-between">
            <TextInput placeholder="Search..." @changed="onSearchInputChanged" />
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
import { ref } from 'vue';
import ButtonSecondary from '../../../ui/buttons/ButtonSecondary.vue';

const props = defineProps({
    files: Array,
    containsSelectedAnalysis: Boolean,
    gpuscoutOutputFolder: String
});

const emit = defineEmits(['analysisSelected', 'folderChanged']);

const searchString = ref('');
const selectedAnalysis = ref('');
const outputDirFolder = ref(null);

function onSearchInputChanged(searchText) {
    searchString.value = searchText;
}

function getTitles() {
    return props.files.filter((file) => file.toLowerCase().includes(searchString.value.toLowerCase()));
}

function onAnalysisSelected(analysisTitle) {
    selectedAnalysis.value = analysisTitle;
    emit('analysisSelected', '', analysisTitle, 'FOLDER');
}

function getSelectedStyle(title) {
    return selectedAnalysis.value === title ? '!bg-primary !text-background' : '';
}

async function chooseFolder() {
    const selectedDirectory = await window.electronAPI.selectDirectory(props.gpuscoutOutputFolder);

    if (selectedDirectory.length > 0) {
        emit('folderChanged', selectedDirectory);
    }
}
</script>
