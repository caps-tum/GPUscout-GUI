<template>
    <a class="select-none rounded bg-secondary px-2 py-2 text-lg text-text hover:cursor-pointer" @click="emit('click')">
        <p>{{ title }}</p>
        <slot></slot>
    </a>
</template>
<script setup>
defineProps({
    title: String
});

const emit = defineEmits(['click']);
</script>
