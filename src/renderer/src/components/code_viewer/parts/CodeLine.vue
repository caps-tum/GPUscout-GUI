<!--
Component for a single line in the code view.
Displays the line number, the line itself, as well as additional information like if the line has stalls, or live register information

Author: Tobias Stuckenberger
-->
<template>
    <div ref="line" class="group relative m-0 flex space-x-1" @click="selectLine()">
        <p
            class="sticky left-0 top-0 flex w-16 shrink-0 select-none flex-row items-center justify-between bg-secondary px-1 !text-text"
            :class="lineNumber !== -1 ? 'group-hover:bg-background' : ''"
        >
            {{ lineNumber !== -1 ? fileLineNumber || lineNumber : '' }}
            <IconWarning v-if="hasStalls" class="h-4 w-4" />
        </p>
        <p class="flex min-h-6 w-full flex-grow border-collapse flex-row flex-wrap overflow-hidden" :class="getHighlight()">
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
                <p class="whitespace-pre text-wrap">{{ tokens.join('') }}</p>
            </template>
        </p>
        <p v-if="showLiveRegisters" class="sticky right-0 top-0 w-16 shrink-0 select-none bg-secondary px-1 text-center">
            {{ liveRegisters[0] || '0' }} | {{ liveRegisters[1] || '0' }}
        </p>
    </div>
</template>
<script setup>
import { computed, onUpdated, ref, watch } from 'vue';
import { CODE_TYPE, useCodeViewerStore } from '../../../stores/CodeViewerStore';
import CodeLineToken from './CodeLineToken.vue';
import { CODE_STYLES } from '../../../../../config/colors';
import IconWarning from '../../ui/icons/IconWarning.vue';

const props = defineProps({
    tokens: Array,
    lineNumber: [Number, String],
    fileLineNumber: [Number, String],
    codeType: Number,
    highlightedLines: Object,
    highlightedTokens: Object,
    scrollToLines: Array,
    isOccurrence: Boolean,
    isInfo: Boolean,
    hasStalls: Boolean,
    currentView: Number,
    selectedOccurrences: Array,
    liveRegisters: Array,
    showLiveRegisters: Boolean,
    hasMapping: Boolean
});

const codeViewerStore = useCodeViewerStore();

const line = ref(null);

const tokensHighlighted = computed(() => {
    for (const token of props.tokens) {
        for (const key of Object.keys(props.highlightedTokens)) {
            if (!props.highlightedTokens[key][token]) {
                continue;
            }
            if (
                (key.startsWith('<=') && props.lineNumber.toString() <= key.substring(2)) ||
                (key.startsWith('>=') && props.lineNumber.toString() >= key.substring(2)) ||
                props.lineNumber.toString() === key ||
                key === '*'
            ) {
                return true;
            }
        }
    }
    return false;
});

onUpdated(() => {
    //console.log(props.lineNumber);
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

    if (props.lineNumber === -1) {
        // Style for special lines in the source code that display the file name
        style += 'bg-secondary !ml-0';
    }

    if (!style.includes('bg-')) {
        // If no background style, apply hover style
        style += ' group-hover:bg-secondary/25';
    }
    return style;
}

// Watch for changes to the scrollToLines array, and scroll to the current line if it was added to it
watch(
    () => props.scrollToLines,
    (newValue) => {
        if (newValue.includes(props.lineNumber)) {
            // Works only if behavior is auto for source code
            line.value.parentNode.scrollTo({
                top: line.value.offsetTop - line.value.parentNode.getBoundingClientRect().height / 2,
                behavior: 'smooth'
            });
        }
    },
    { deep: true }
);
</script>
<style scoped>
div:has(+ .group > .border-2) > .border-2 {
    @apply border-b-0;
}
</style>
