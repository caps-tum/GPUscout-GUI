<template>
    <a class="flex h-24 w-full cursor-pointer flex-row items-center space-x-2 rounded bg-red-400 p-2">
        <img src="../../../assets/folder-open-regular.svg" class="h-20 w-20" alt="folder" />
        <div class="flex flex-col">
            <p class="text-lg">Choose GPUscout output directory</p>
            <p v-for="t in getTitles()" :key="t">{{ t }}</p>
        </div>
    </a>
</template>
<script setup>
const props = defineProps({
    files: Array
});

function getTitles() {
    return props.files
        .filter((file) => file.startsWith('result-'))
        .map((file) => file.replace('result-', '').replace('.json', ''))
        .map((file) => file.charAt(0).toUpperCase() + file.slice(1));
}
</script>
