<template>
    <a class="cursor-pointer rounded p-1 text-text hover:bg-secondary" :class="getBackground()" @click="emit('select')">
        <p class="font-bold">{{ kernel }}</p>
        <p class="whitespace-nowrap">
            {{ infos[0] }} Analys{{ infos[0] !== 1 ? 'es' : 'is' }} | {{ infos[1] }} Info{{ infos[1] !== 1 ? 's' : '' }} |
            {{ infos[2] }} Warning{{ infos[2] !== 1 ? 's' : '' }}
        </p>
    </a>
</template>
<script setup>
const props = defineProps({
    kernel: String,
    currentKernel: String,
    infos: Array
});

const emit = defineEmits(['select']);

function getBackground() {
    if (props.currentKernel === props.kernel) {
        return 'bg-primary border border-background !text-background';
    }
    return props.infos[0] > 0 ? 'bg-background' : 'bg-gray-500';
}
</script>
