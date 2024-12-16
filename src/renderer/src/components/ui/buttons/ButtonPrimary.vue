<!--
Component for a primary button.

Author: Tobias Stuckenberger
-->
<template>
    <a
        v-if="!disabled"
        class="flex select-none flex-col items-center justify-center rounded bg-primary px-8 py-2 text-lg text-background hover:cursor-pointer"
        @click="emit('click')"
    >
        <p class="text-center">{{ title }}</p>
        <slot></slot>
    </a>
    <a
        v-else
        class="flex select-none flex-col items-center justify-center rounded bg-primary/50 px-8 py-2 text-lg text-background"
        @click="emit('click')"
    >
        <p class="text-center">{{ title }}</p>
        <slot></slot>
    </a>
</template>
<script setup>
defineProps({
    title: String,
    disabled: Boolean
});

const emit = defineEmits(['click']);
</script>
