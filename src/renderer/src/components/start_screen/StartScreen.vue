<template>
    <div class="flex h-full w-full flex-row items-center justify-center">
        <div class="w-1/2">
            <a
                class="flex h-24 w-full cursor-pointer flex-row items-center space-x-2 rounded bg-red-400 p-2"
                @click="fileInput.click()"
            >
                <img src="../../assets/folder-open-regular.svg" class="h-20 w-20" alt="folder" />
                <div class="flex flex-col">
                    <p class="text-lg">Choose GPUscout output directory</p>
                    <p class="">{{ numSelectedFiles > 0 ? numSelectedFiles : 'No' }} files selected</p>
                </div>
            </a>
            <p class="w-full py-1 text-center text-xl font-bold">OR</p>
            <div class="rounded bg-blue-400 p-2">
                <p class="text-lg">Select recent analysis</p>
                <input type="text" class="mb-1 w-full rounded p-1" placeholder="Search..." />
                <ul class="max-h-72 space-y-1 overflow-y-auto">
                    <li v-for="x in 15" :key="x" class="flex cursor-pointer flex-col rounded bg-blue-100 p-1">
                        <p>Title of the Analysis</p>
                        <p class="text-sm">2 Kernels - 3 Recommendations</p>
                    </li>
                </ul>
            </div>
        </div>
        <button class="absolute bottom-2 right-2 h-12 w-32 rounded bg-green-400" @click="proceed">Proceed</button>
        <input ref="fileInput" type="file" webkitdirectory="true" class="hidden" @input="onSelectDirectory" />
    </div>
</template>
<script setup>
import { ref } from 'vue';
import { useDataStore } from '../../stores/DataStore';
import { CONTEXT, useContextStore } from '../../stores/ContextStore';

const dataStore = useDataStore();
const contextStore = useContextStore();

const fileInput = ref(null);

const analysisData = ref(null);
const sassCode = ref(null);
const ptxCode = ref(null);
const sourceCode = ref([]);
const numSelectedFiles = ref(0);

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
        (file) => file.webkitRelativePath.includes('nvdisasm-executable-') && file.webkitRelativePath.endsWith('-ptx.txt')
    );
    if (!ptxFile) {
        console.error('No ptx file');
    } else {
        ptxCode.value = ptxFile;
    }

    const sassFile = files.find(
        (file) => file.webkitRelativePath.includes('nvdisasm-executable-') && file.webkitRelativePath.endsWith('-sass.txt')
    );
    if (!sassFile) {
        console.error('No sass file');
    } else {
        sassCode.value = sassFile;
    }

    sourceCode.value = files.filter((file) => file.webkitRelativePath.includes('source/'));
    numSelectedFiles.value = files.length;
}

async function proceed() {
    await dataStore.initialize(analysisData.value, sassCode.value, ptxCode.value, sourceCode.value);
    contextStore.setCurrentContext(CONTEXT.CODE_VIEW);
}
</script>
