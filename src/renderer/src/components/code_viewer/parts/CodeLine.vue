<template>
    <div ref="line" class="group m-0 flex space-x-1" @click="selectLine">
        <p class="sticky left-0 top-0 w-16 shrink-0 select-none bg-secondary px-1 group-hover:bg-gray-200">
            {{ lineNumber }}
        </p>
        <p class="flex h-6 max-h-6 w-full flex-grow flex-row text-nowrap group-hover:bg-blue-400" :class="getHighlight()">
            <CodeLineToken
                v-for="token in tokens"
                :key="token"
                :line-number="lineNumber"
                :mode="codeType"
                :token="token"
                :highlighted-tokens="highlightedTokens"
            />
        </p>
    </div>
</template>
<script setup>
import { ref } from 'vue';
import { CODE_TYPE, useCodeViewerStore } from '../../../stores/CodeViewerStore';
import CodeLineToken from './CodeLineToken.vue';
import { Occurrence } from '../../../utils/Analysis';

const props = defineProps({
    tokens: Array,
    lineNumber: [Number, String],
    codeType: Number,
    highlightedLines: Object,
    highlightedTokens: Object,
    isOccurrence: Boolean,
    currentView: Number,
    selectedOccurrence: Occurrence
});

const codeViewerStore = useCodeViewerStore();

const line = ref(null);

function selectLine() {
    codeViewerStore.setCurrentView(props.codeType);
    codeViewerStore.setSelectedLine(props.lineNumber);
}

/**
 * Determines the background style of this code line:
 * - The line an occurrence -> red border
 * - The line is selected and an occurrence -> blue
 * - The line is present in props.highlightedLines -> either light or normal green, depending on boolean value
 * @returns {String}
 */
function getHighlight() {
    let style = '';
    if (props.isOccurrence) {
        style += 'border-2 border-red-400';
    }
    if (
        props.selectedOccurrence &&
        ((props.codeType === CODE_TYPE.SOURCE_CODE && props.selectedOccurrence.sourceLineNumber == props.lineNumber) ||
            (props.codeType !== CODE_TYPE.SOURCE_CODE && props.selectedOccurrence.binaryLineNumber === props.lineNumber))
    ) {
        // The current line belongs to the currently selected occurrence
        if (props.codeType !== props.currentView) {
            // Scroll to the occurrence if we are not in the selected code view
            line.value.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        style += props.codeType === props.currentView ? ' bg-sky-400' : ' bg-sky-300';
    } else if (props.highlightedLines[props.lineNumber] !== undefined) {
        // The current line does not belong to any occurrence directly, but is still highlighted in some way
        if (
            props.highlightedLines[props.lineNumber] === false &&
            props.lineNumber == Object.keys(props.highlightedLines)[0] &&
            !props.selectedOccurrence &&
            props.currentView !== props.codeType
        ) {
            // Scroll to this line, if it is not in the currently selected code view, no occurrence is currently selected and this is the topmost line of all highlighted ones
            line.value.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        style += props.highlightedLines[props.lineNumber] ? ' bg-green-400' : ' bg-green-200';
    }
    return style;
}
</script>
