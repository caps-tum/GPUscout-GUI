<template>
    <div class="relative">
        <a class="flex flex-col -space-y-1 rounded bg-primary py-1 pl-2 pr-3 text-background" @click="emit('click')">
            <p class="pr-6 text-lg">{{ title }}</p>
            <p class="text-sm text-background/50">{{ hint }}</p>
            <p class="text-lg">{{ value }}</p>
        </a>
        <ButtonHelp class="absolute right-2 top-2" />
    </div>
</template>
<script setup>
import ButtonHelp from './ButtonHelp.vue';

defineProps({
    title: String,
    hint: String,
    value: [Number, String]
});

const emit = defineEmits(['click']);
</script>
