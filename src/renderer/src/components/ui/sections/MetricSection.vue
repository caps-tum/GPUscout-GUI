<template>
    <div class="flex flex-col p-2 pt-1 rounded bg-secondary/50">
        <p class="text-xl text-text">{{ title }}</p>
        <p v-if="hint" class="text-sm text-text/50 -mt-2">{{ hint }}</p>
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
    })
</script>
