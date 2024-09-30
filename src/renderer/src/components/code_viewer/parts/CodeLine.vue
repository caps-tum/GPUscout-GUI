<template>
    <div class="group m-0 flex space-x-1" @click="selectLine">
        <p
            class="sticky left-0 top-0 w-16 shrink-0 select-none bg-gray-600 px-1 group-hover:bg-gray-200"
            :class="getHighlight()"
        >
            {{ lineNumber }}
        </p>
        <p class="flex h-6 max-h-6 flex-grow flex-row text-nowrap group-hover:bg-blue-400" :class="getHighlight()">
            <CodeLineToken
                v-for="token in tokens"
                :key="token"
                :line-number="lineNumber"
                :mode="codeType"
                :token="token"
                :highlighted-tokens="highLightedTokens"
            />
        </p>
    </div>
</template>
<script setup>
import { useCodeViewerStore } from '../../../stores/CodeViewerStore';
import CodeLineToken from './CodeLineToken.vue';

const props = defineProps({
    tokens: Array,
    lineNumber: [Number, String],
    codeType: Number,
    highlightedLines: Object,
    highLightedTokens: Object
});

const codeViewerStore = useCodeViewerStore();

function selectLine() {
    codeViewerStore.setCurrentView(props.codeType);
    codeViewerStore.setSelectedLine(props.lineNumber);
}

function getHighlight() {
    if (props.highlightedLines[props.lineNumber] !== undefined) {
        return props.highlightedLines[props.lineNumber] ? 'bg-green-400' : 'bg-green-200';
    }
    return '';
}
</script>
