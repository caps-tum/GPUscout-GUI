<template>
    <div class="flex h-full w-full items-center justify-center">
        <div>
            <input type="file" webkitdirectory="true" @input="onSelectDirectory" />
            <button class="bg-green-400" @click="proceed">Proceed</button>
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue';
import { useDataStore } from '../../stores/DataStore';

const dataStore = useDataStore();

const analysisData = ref(null);
const sassCode = ref(null);
const ptxCode = ref(null);
const sourceCode = ref([]);

async function onSelectDirectory(event) {
    const files = Array.from(event.target.files);

    // Check for result.json
    const mainFile = files.find((file) => file.webkitRelativePath.includes('result.json'));
    if (!mainFile) {
        console.error('No result.json');
    } else {
        analysisData.value = mainFile;
    }

    // TODO: check for all source files
    const ptxFile = files.find(
        (file) =>
            file.webkitRelativePath.includes('nvdisasm-executable-') &&
            file.webkitRelativePath.endsWith('-ptx.txt')
    );
    if (!ptxFile) {
        console.error('No ptx file');
    } else {
        ptxCode.value = ptxFile;
    }

    const sassFile = files.find(
        (file) =>
            file.webkitRelativePath.includes('nvdisasm-executable-') &&
            file.webkitRelativePath.endsWith('-sass.txt')
    );
    if (!sassFile) {
        console.error('No sass file');
    } else {
        sassCode.value = sassFile;
    }

    sourceCode.value = files.filter((file) => file.webkitRelativePath.includes('source/'));
}

function proceed() {
    dataStore.initialize(analysisData.value, sassCode.value, ptxCode.value, sourceCode.value);
}
</script>
