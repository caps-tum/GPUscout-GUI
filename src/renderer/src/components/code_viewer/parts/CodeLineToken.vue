<template>
    <p :class="getHighlight()">{{ token }}</p>
    &nbsp;
</template>
<script setup>
import { CODE_VIEW, useCodeViewerStore } from '../../../stores/CodeViewerStore';
import { computed } from 'vue';

const props = defineProps({
    lineNumber: [String, Number],
    mode: Number,
    token: String
});

const codeViewerStore = useCodeViewerStore();

const sourceTokenHighlightRules = computed(() => codeViewerStore.getSourceTokenHighlightRules);
const sassTokenHighlightRules = computed(() => codeViewerStore.getSassTokenHighlightRules);

function getHighlight() {
    if (props.mode === CODE_VIEW.SOURCE_CODE) {
        for (const rule of sourceTokenHighlightRules.value) {
            if (rule[0](props.token)) {
                return rule[1];
            }
        }
    } else if (props.mode === CODE_VIEW.BINARY_CODE) {
        for (const rule of sassTokenHighlightRules.value) {
            if (rule[0](props.token)) {
                return rule[1];
            }
        }
    }
    return '';
}
</script>
