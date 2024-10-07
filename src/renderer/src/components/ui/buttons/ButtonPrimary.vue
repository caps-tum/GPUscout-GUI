<template>
    <a
        v-if="enabled"
        class="select-none rounded bg-primary px-8 py-2 text-lg text-background hover:cursor-pointer"
        @click="emit('click')"
    >
        <p>{{ title }}</p>
        <slot></slot>
    </a>
    <a v-else class="select-none rounded bg-primary/50 px-8 py-2 text-lg text-background" @click="emit('click')">
        <p>{{ title }}</p>
        <slot></slot>
    </a>
</template>
<script setup>
defineProps({
    title: String,
    enabled: Boolean
});

const emit = defineEmits(['click']);
</script>
