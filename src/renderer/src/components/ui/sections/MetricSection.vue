<template>
    <div class="flex flex-col rounded bg-secondary/50 p-2 pt-1">
        <div class="flex flex-row items-center space-x-2">
            <p class="text-xl text-text">{{ title }}</p>
            <a v-if="canHide" class="mt-1 cursor-pointer select-none text-text/50" @click="hidden = !hidden">{{
                hidden ? 'Show' : 'Hide'
            }}</a>
        </div>
        <p v-if="hint" class="-mt-1 text-sm text-text/50">{{ hint }}</p>
        <div v-show="!hidden" class="flex flex-row gap-x-2 gap-y-2">
            <slot></slot>
        </div>
        <p v-if="helpString && !hidden" class="text-sm text-text/50">{{ helpString }}</p>
    </div>
</template>
<script setup>
import { ref } from 'vue';

defineProps({
    title: String,
    hint: String,
    helpString: String,
    canHide: Boolean
});

const hidden = ref(false);
</script>
