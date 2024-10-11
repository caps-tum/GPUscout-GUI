<template>
    <div class="relative flex-grow">
        <a
            class="flex flex-col -space-y-1 rounded bg-primary py-1 pl-2 pr-3 text-background hover:cursor-pointer"
            @click="emit('click')"
        >
            <p class="pr-6 text-lg">{{ data.display_name || data.title }}</p>
            <p class="text-sm text-background/50">{{ data.hint || '' }}</p>
            <p v-if="!useCustomFormat && totalStalls !== undefined" class="text-lg">
                {{ data.format_function(value, totalStalls) }}
            </p>
            <p v-else-if="!useCustomFormat" class="text-lg">{{ data.format_function(value) }}</p>
            <p v-else class="text-lg">{{ value }}</p>
        </a>
        <ButtonHelp v-if="data.help_text" class="absolute right-2 top-2" @click="showHelpPopup" />
    </div>
</template>
<script setup>
import { POPUP, useContextStore } from '../../../stores/ContextStore';
import ButtonHelp from './ButtonHelp.vue';

const props = defineProps({
    data: Object,
    value: [Number, String],
    useCustomFormat: Boolean,
    totalStalls: Number
});

const emit = defineEmits(['click']);

const contextStore = useContextStore();

function showHelpPopup() {
    contextStore.togglePopup(POPUP.METRIC_HELP, true, {
        metricName: props.data.display_name || props.data.title,
        helpText: props.data.help_text
    });
}
</script>
