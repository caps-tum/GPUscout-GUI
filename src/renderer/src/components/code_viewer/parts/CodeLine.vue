<!--
Component for a single line in the code view.
Displays the line number, the line itself, as well as additional information like if the line has stalls, or live register information

Author: Tobias Stuckenberger
-->
<template>
    <div ref="line" class="group relative m-0 flex space-x-1" @click="selectLine()">
        <p
            class="sticky left-0 top-0 flex w-16 shrink-0 select-none flex-row items-center justify-between bg-secondary px-1 !text-text group-hover:bg-background"
        >
            {{ lineNumber || '' }}
            <IconWarning v-if="stalls.totalLine > 0" :class="getStallColor()" class="h-4 w-4" />
        </p>
        <p class="flex max-h-6 min-h-6 flex-grow border-collapse flex-row whitespace-pre" :class="getHighlight()">
            <template v-if="codeType !== CODE_TYPE.SOURCE_CODE && tokensHighlighted">
                <CodeLineToken
                    v-for="token in tokens"
                    :key="token"
                    :line-number="lineNumber"
                    :mode="codeType"
                    :token="token"
                    :highlighted-tokens="highlightedTokens"
                />
            </template>
            <template v-else>
                {{ tokens.join('') }}
            </template>
        </p>
        <p v-if="showLiveRegisters" class="sticky right-0 top-0 w-16 shrink-0 select-none bg-secondary px-1 text-center">
            {{ liveRegisters[0] || '0' }} | {{ liveRegisters[1] || '0' }}
        </p>
    </div>
</template>
<script setup>
import { computed, ref } from 'vue';
import { CODE_TYPE, useCodeViewerStore } from '../../../stores/CodeViewerStore';
import CodeLineToken from './CodeLineToken.vue';
import { CODE_STYLES } from '../../../../../config/colors';
import IconWarning from '../../ui/icons/IconWarning.vue';

const props = defineProps({
    tokens: Array,
    lineNumber: [Number, String],
    codeType: Number,
    highlightedLines: Object,
    highlightedTokens: Object,
    isOccurrence: Boolean,
    isInfo: Boolean,
    stalls: Object,
    currentView: Number,
    selectedOccurrences: Array,
    liveRegisters: Array,
    showLiveRegisters: Boolean,
    hasMapping: Boolean
});

const codeViewerStore = useCodeViewerStore();

const line = ref(null);

function getStallColor() {
    const ratio = props.stalls.totalLine / props.stalls.total;
    if (ratio > 0.1) return 'fill-red-500';
    if (ratio > 0.075) return 'fill-red-400';
    if (ratio > 0.05) return 'fill-red-300';
    if (ratio > 0.025) return 'fill-red-200';
    return 'fill-text';
}

const tokensHighlighted = computed(() => {
    for (const token of props.tokens) {
        for (const key of Object.keys(props.highlightedTokens)) {
            if (!props.highlightedTokens[key][token]) {
                continue;
            }
            if (
                key === '*' ||
                props.lineNumber.toString() === key ||
                (key.startsWith('<=') && props.lineNumber.toString() <= key.substring(2)) ||
                (key.startsWith('>=') && props.lineNumber.toString() >= key.substring(2))
            ) {
                return true;
            }
        }
    }
    return false;
});

/**
 * Select the current line and code view when clicked on it
 */
function selectLine() {
    codeViewerStore.setCurrentView(props.codeType);
    codeViewerStore.setSelectedLine(props.lineNumber);
}

/**
 * Determines the background style of this code line
 * @returns {String}
 */
function getHighlight() {
    let style = '';
    if (!props.hasMapping) {
        style += CODE_STYLES.SOURCE_LINE_WITHOUT_MAPPING + ' ';
    }
    if (props.isOccurrence) {
        // Mark occurrences
        style += CODE_STYLES.OCCURRENCE + ' ';
    }
    if (props.isInfo) {
        // Mark occurrences
        style += CODE_STYLES.INFO_OCCURRENCE + ' ';
    }

    if (props.highlightedLines[props.lineNumber] !== undefined) {
        // Highlight line if needed
        style += props.highlightedLines[props.lineNumber];
    }

    if (!style.includes('bg-')) {
        // If no background style, apply hover style
        style += ' group-hover:bg-secondary/25';
    }
    return style;
}
</script>
<style scoped>
div:has(+ .group > .border-2) > .border-2 {
    @apply border-b-0;
}
</style>
