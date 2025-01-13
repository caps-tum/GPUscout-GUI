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
        <div
            ref="lineContainer"
            class="h-full w-full overflow-y-auto"
            @scroll="onScroll"
            :class="codeType !== CODE_TYPE.SOURCE_CODE ? 'overflow-x-hidden' : 'overflow-x-auto'"
        >
            <div
                v-if="relevantLines.length - firstVisibleLine > 0"
                class="relative"
                :style="{ height: relevantLines.length * 1.5 + 'rem' }"
            >
                <div
                    v-for="index in Math.min(150, relevantLines.length - firstVisibleLine)"
                    :key="relevantLines[index + firstVisibleLine - 1]"
                    class="absolute w-full"
                    :style="{ top: (index - 1 + firstVisibleLine) * 1.5 + 'rem' }"
                >
                    <CodeLine
                        :tokens="relevantLines[index + firstVisibleLine - 1].tokens"
                        :line-number="relevantLines[index + firstVisibleLine - 1].address"
                        :live-registers="relevantLines[index + firstVisibleLine - 1].liveRegisters"
                        :has-mapping="
                            codeType === CODE_TYPE.SOURCE_CODE
                                ? binaryCodeType === CODE_TYPE.SASS_CODE
                                    ? relevantLines[index + firstVisibleLine - 1].hasSassMapping
                                    : relevantLines[index + firstVisibleLine - 1].hasPtxMapping
                                : true
                        "
                        :code-type="codeType"
                        :highlighted-lines="highlightedLines"
                        :highlighted-tokens="highlightedTokens"
                        :has-stalls="
                            codeType !== CODE_TYPE.PTX_CODE &&
                            Object.keys(relevantLines[index + firstVisibleLine - 1].stalls).length > 0
                        "
                        :is-occurrence="occurrenceLines.includes(relevantLines[index + firstVisibleLine - 1].address)"
                        :is-info="infoLines.includes(relevantLines[index + firstVisibleLine - 1].address)"
                        :current-view="currentView"
                        :selected-occurrences="selectedOccurrences"
                        :show-live-registers="displayLiveRegisters && codeType === CODE_TYPE.SASS_CODE"
                    />
                </div>
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
import { computed, ref, watch } from 'vue';

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
const lineContainer = ref(null);

const currentSourceFile = computed(() => codeViewerStore.getCurrentSourceFile);
const sourceFiles = computed(() =>
    props.isComparisonCode
        ? dataStore.getGPUscoutComparisonResult().getSourceFileNames(currentKernel.value)
        : dataStore.getGPUscoutResult().getSourceFileNames(currentKernel.value)
);
const relevantLines = computed(() =>
    props.codeLines.filter(
        (l) =>
            (props.codeType === CODE_TYPE.SOURCE_CODE &&
                ((binaryCodeType.value === CODE_TYPE.SASS_CODE && l.hasSassRelevance) ||
                    (binaryCodeType.value === CODE_TYPE.PTX_CODE && l.hasPtxRelevance))) ||
            props.codeType !== CODE_TYPE.SOURCE_CODE
    )
);
const firstVisibleLine = ref(0);

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

async function onScroll(event) {
    firstVisibleLine.value = Math.max(Math.floor(event.target.scrollTop / 24) - 50, 0);
}

watch(
    () => props.scrollToLines,
    (newValue) => {
        for (const address of newValue) {
            if (address < 0 || !address) continue;
            const index = relevantLines.value.findIndex((l) => l.address === address);
            if (index < 0) continue;
            const scrollTo = index * 24 - lineContainer.value.getBoundingClientRect().height / 2;
            lineContainer.value.scrollTo({
                top: scrollTo,
                behavior: Math.abs(lineContainer.value.scrollTop - scrollTo) < 24 * 50 ? 'smooth' : 'instant'
            });
        }
    },
    { deep: true }
);
</script>
<style scoped>
p {
    @apply sticky top-0 z-10 bg-secondary text-center text-text;
}
</style>
