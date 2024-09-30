<template>
    <div class="flex flex-col rounded bg-secondary/50 p-2 pt-1">
        <p class="text-xl text-text">{{ title }}</p>
        <p v-if="hint" class="-mt-2 text-sm text-text/50">{{ hint }}</p>
        <div class="flex flex-row space-x-2">
            <slot></slot>
        </div>
        <p v-if="helpString" class="text-text">{{ helpString }}</p>
    </div>
</template>
<script setup>
defineProps({
    title: String,
    hint: String,
    helpString: String
});
</script>
