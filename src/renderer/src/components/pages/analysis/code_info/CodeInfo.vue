<template>
    <div class="flex flex-col">
        <template v-for="occurrence of occurrences" :key="occurrence">
            <p class="sticky top-0 rounded-t bg-secondary p-1 text-center text-text">
                {{ occurrence?.title() || 'No title' }}
            </p>
            <p class="whitespace-pre-line p-1" v-html="occurrence.description()"></p>
        </template>
        <p v-show="occurrences.length === 0 && Object.keys(stalls).length === 0" class="whitespace-pre-line p-1">
            {{ getNoOccurrenceString() }}
        </p>
        <p
            v-show="Object.keys(stalls).length > 0"
            class="sticky top-0 z-10 rounded-t bg-secondary p-1 text-center text-text"
        >
            {{ TEXT.code_view.code_info.stalls_title }}
        </p>
        <CodeInfoSampling v-if="Object.keys(stalls).length > 0" :stalls="stalls" />
        <p
            v-show="occurrences.length === 1 && occurrences[0].recommendations().length > 0"
            class="sticky top-0 rounded-t bg-secondary p-1 text-center text-text"
        >
            {{ TEXT.code_view.code_info.recommendations_title }}
        </p>
        <p
            v-show="occurrences.length === 1 && occurrences[0].recommendations().length > 0"
            class="whitespace-pre-line p-1"
            v-html="occurrences[0]?.recommendations()"
        ></p>
    </div>
</template>
<script setup>
import { computed } from 'vue';
import { useCodeViewerStore } from '../../../../stores/CodeViewerStore';
import { TEXT } from '../../../../../../config/text';
import CodeInfoSampling from './CodeInfoSampling.vue';

defineProps({
    analysis: String,
    kernel: String,
    occurrences: Array,
    stalls: Object
});

const codeViewerStore = useCodeViewerStore();

const selectedLine = computed(() => codeViewerStore.getSelectedLine);

/**
 * @returns {String} The string to display when no occurrence is selected
 */
function getNoOccurrenceString() {
    if (!selectedLine.value) {
        return TEXT.analyses.general.code_info.no_line_selected;
    }
    return TEXT.analyses.general.code_info.no_info;
}
</script>
