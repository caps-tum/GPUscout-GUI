<!--
Component for a single code view. Displays the title, current file and file contents.

Author: Tobias Stuckenberger
-->
<template>
    <div class="relative flex h-full w-full flex-col bg-secondary/50">
        <p v-if="codeType === CODE_TYPE.SOURCE_CODE">Source Code</p>
        <p v-else-if="codeType === CODE_TYPE.SASS_CODE">SASS Code</p>
        <p v-if="codeType === CODE_TYPE.PTX_CODE">PTX Code</p>
        <div
            v-if="codeType === CODE_TYPE.SASS_CODE && displayLiveRegisters"
            class="absolute right-2 top-0 z-50 flex flex-row items-center space-x-1"
        >
            <p>Live Reg.</p>
            <ButtonHelp class="*:h-4 *:w-4 *:fill-text" @click="showLiveRegisterHelp" />
        </div>
        <div class="relative flex h-full w-full flex-col overflow-x-auto">
            <div v-if="codeType === CODE_TYPE.SOURCE_CODE" class="sticky top-0 z-10 m-0 w-full bg-secondary">
                <select
                    ref="sourceFileSelector"
                    class="mx-1 max-w-full overflow-hidden text-ellipsis bg-secondary px-2 text-left"
                    style="direction: rtl"
                    :value="currentSourceFile"
                    @change="onChangeSourceFile"
                >
                    <option v-for="file in sourceFiles" :key="file" :value="file">
                        {{ file }}
                    </option>
                </select>
            </div>
            <CodeLine
                v-for="line in codeLines.filter(
                    (l) =>
                        (codeType === CODE_TYPE.SOURCE_CODE &&
                            ((binaryCodeType === CODE_TYPE.SASS_CODE && l.hasSassRelevance) ||
                                (binaryCodeType === CODE_TYPE.PTX_CODE && l.hasPtxRelevance))) ||
                        codeType !== CODE_TYPE.SOURCE_CODE
                )"
                :key="line"
                :tokens="line.tokens"
                :line-number="line.address"
                :live-registers="line.liveRegisters"
                :has-mapping="
                    codeType === CODE_TYPE.SOURCE_CODE
                        ? binaryCodeType === CODE_TYPE.SASS_CODE
                            ? line.hasSassMapping
                            : line.hasPtxMapping
                        : true
                "
                :code-type="codeType"
                :highlighted-lines="highlightedLines"
                :highlighted-tokens="highlightedTokens"
                :scroll-to-lines="scrollToLines"
                :has-stalls="codeType !== CODE_TYPE.PTX_CODE && Object.keys(line.stalls).length > 0"
                :is-occurrence="occurrenceLines.includes(line.address)"
                :is-info="infoLines.includes(line.address)"
                :current-view="currentView"
                :selected-occurrences="selectedOccurrences"
                :show-live-registers="displayLiveRegisters && codeType === CODE_TYPE.SASS_CODE"
            />
            <div class="relative m-0 flex min-h-0 grow space-x-1">
                <p class="sticky left-0 top-0 w-16 shrink-0 select-none bg-secondary px-1"></p>
            </div>
        </div>
    </div>
</template>
<script setup>
import { TEXT } from '../../../../config/text';
import { CODE_TYPE, useCodeViewerStore } from '../../stores/CodeViewerStore';
import { POPUP, useContextStore } from '../../stores/ContextStore';
import { useDataStore } from '../../stores/DataStore';
import ButtonHelp from '../ui/buttons/ButtonHelp.vue';
import CodeLine from './parts/CodeLine.vue';
import { computed, ref } from 'vue';

const props = defineProps({
    codeType: Number,
    codeLines: Array,
    highlightedLines: Object,
    highlightedTokens: Object,
    scrollToLines: Array,
    occurrenceLines: Array,
    infoLines: Array,
    currentView: Number,
    isComparisonCode: Boolean
});

const dataStore = useDataStore();
const codeViewerStore = useCodeViewerStore();
const contextStore = useContextStore();

const selectedOccurrences = computed(() => dataStore.getCurrentOccurrences);
const displayLiveRegisters = computed(() => codeViewerStore.getSassRegistersVisible);
const binaryCodeType = computed(() => codeViewerStore.getCurrentBinary);
const currentKernel = computed(() => dataStore.getCurrentKernel);

const sourceFileSelector = ref(null);

const currentSourceFile = computed(() => codeViewerStore.getCurrentSourceFile);
const sourceFiles = computed(() =>
    props.isComparisonCode
        ? dataStore.getGPUscoutComparisonResult().getSourceFileNames(currentKernel.value)
        : dataStore.getGPUscoutResult().getSourceFileNames(currentKernel.value)
);

function onChangeSourceFile() {
    codeViewerStore.setCurrentSourceFile(sourceFileSelector.value.value);
}

/**
 * Show the help popup for the live registers
 */
function showLiveRegisterHelp() {
    contextStore.togglePopup(POPUP.METRIC_HELP, true, {
        metricName: TEXT.code_view.help_texts.live_registers.title,
        helpText: TEXT.code_view.help_texts.live_registers.help_text
    });
}
</script>
<style scoped>
p {
    @apply sticky top-0 z-10 bg-secondary text-center text-text;
}
</style>
