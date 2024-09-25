<template>
    <div class="rounded bg-secondary/50 p-4 text-text">
        <p class="-mb-2 text-lg">Available analyses in GPUscout output directory</p>
        <p class="text-sm">Only analyses where all necessary files have been found are displayed</p>
        <TextInput placeholder="Search..." class="my-1" @changed="onSearchInputChanged" />
        <div class="flex max-h-[25vh] flex-col space-y-1 overflow-y-auto">
            <ButtonSecondary
                v-for="title in getTitles()"
                :key="title"
                :title="title"
                :on-click="() => onAnalysisSelected(title)"
            >
                <p v-show="selectedAnalysis === title" class="inline-block">S</p>
            </ButtonSecondary>
        </div>
    </div>
</template>
<script setup>
import TextInput from '../../../ui/TextInput.vue';
import { ref } from 'vue';
import ButtonSecondary from '../../../ui/ButtonSecondary.vue';

const props = defineProps({
    files: Array,
    containsSelectedAnalysis: Boolean
});

const emit = defineEmits(['analysisSelected']);

const searchString = ref('');
const selectedAnalysis = ref('');

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
</script>
