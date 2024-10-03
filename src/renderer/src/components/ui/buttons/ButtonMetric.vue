<template>
    <div class="relative">
        <a class="flex flex-col -space-y-1 rounded bg-primary py-1 pl-2 pr-3 text-background" @click="emit('click')">
            <p class="pr-6 text-lg">{{ data.display_name }}</p>
            <p class="text-sm text-background/50">{{ data.hint }}</p>
            <p v-if="!useCustomFormat" class="text-lg">{{ data.format_function(value) }}</p>
            <p v-else class="text-lg">{{ value }}</p>
        </a>
        <ButtonHelp v-if="data.help_text" class="absolute right-2 top-2" />
    </div>
</template>
<script setup>
import ButtonHelp from './ButtonHelp.vue';

defineProps({
    data: Object,
    value: [Number, String],
    useCustomFormat: Boolean
});

const emit = defineEmits(['click']);
</script>
