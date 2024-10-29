<template>
    <div class="flex h-full w-full flex-col items-center justify-center">
        <p class="mb-20 text-9xl font-bold">GPUscout-GUI</p>
        <div class="flex w-full flex-row justify-center space-x-4 px-12">
            <div class="flex max-h-full w-full flex-col">
                <SelectAnalysis @analysis-selected="onAnalysisSelected" />
                <p class="w-full py-1 text-center text-xl font-bold">OR</p>
                <AnalysesFromFolder
                    :gpuscout-output-folder="config['gpuscoutOutputFolder']"
                    @analysis-selected="onAnalysisSelected"
                    @folder-changed="folderChanged"
                />
            </div>
            <div class="flex max-h-full w-full flex-col">
                <SelectAnalysis @analysis-selected="onComparisonAnalysisSelected" />
                <p class="w-full py-1 text-center text-xl font-bold">OR</p>
                <AnalysesFromFolder
                    :gpuscout-output-folder="config['gpuscoutOutputFolder']"
                    @analysis-selected="onComparisonAnalysisSelected"
                    @folder-changed="folderChanged"
                />
            </div>
        </div>
        <ButtonPrimary
            :disabled="selectedAnalysisPath === ''"
            title="Proceed"
            class="absolute bottom-2 right-2"
            @click="proceed"
        />
    </div>
</template>
<script setup>
import { computed } from 'vue';
import { useConfigStore } from '../../../stores/ConfigStore';
import AnalysesFromFolder from './analyses_from_folder/AnalysesFromFolder.vue';
import { ref } from 'vue';
import SelectAnalysis from './SelectAnalysis.vue';
import { useDataStore } from '../../../stores/DataStore';
import { useContextStore, CONTEXT } from '../../../stores/ContextStore';
import ButtonPrimary from '../../ui/buttons/ButtonPrimary.vue';

const configStore = useConfigStore();
const dataStore = useDataStore();
const contextStore = useContextStore();

const config = computed(() => configStore.getConfig);

const selectedAnalysisPath = ref('');
const selectedComparisonAnalysisPath = ref('');

async function folderChanged(directory) {
    configStore.setOption('gpuscoutOutputFolder', directory);
}

function onAnalysisSelected(analysisPath) {
    selectedAnalysisPath.value = analysisPath;
}

function onComparisonAnalysisSelected(analysisPath) {
    selectedComparisonAnalysisPath.value = analysisPath;
}

async function proceed() {
    // TODO move to button
    const mt4g = `GPU_INFORMATION; GPU_vendor; "Nvidia"; GPU_name; "NVIDIA GeForce RTX 4080"
COMPUTE_RESOURCE_INFORMATION; CUDA_compute_capability; "8.90"; Number_of_streaming_multiprocessors; 76; Number_of_cores_in_GPU; 9728; Number_of_cores_per_SM; 128
REGISTER_INFORMATION; Registers_per_thread_block; 65536; "32-bit registers"; Registers_per_SM; 65536; "32-bit registers"
ADDITIONAL_INFORMATION; Memory_Clock_Frequency; 11.201; "GHz"; Memory_Bus_Width; 256; "bit"; GPU_Clock_Rate; 2.505; "GHz"
L1_DATA_CACHE; Size; 21.636719; KiB; "="; Cache_Line_Size; 32; "B"; Load_Latency; 40; "cycles"; Load_Latency; 14; "nanoseconds"; Shared_On; "SM-level"; Share_Cache_With_Texture; 1; Share_Cache_With_Read-Only; 1; Share_Cache_With_ConstantL1; 0; Caches_Per_SM; 1
L2_DATA_CACHE; Size; 32.000; MiB; "="; Cache_Line_Size; 32; "B"; Load_Latency; 260; "cycles"; Load_Latency; 93; "nanoseconds"; Shared_On; "GPU-level"; Caches_Per_GPU; 2
TEXTURE_CACHE; Size; 21.011719; KiB; "="; Cache_Line_Size; 32; "B"; Load_Latency; 96; "cycles"; Load_Latency; 34; "nanoseconds"; Shared_On; "SM-level"; Share_Cache_With_L1_Data; 1; Share_Cache_With_Read-Only; 1; Caches_Per_SM; 1
READ-ONLY_CACHE; Size; 21.636719; KiB; "="; Cache_Line_Size; 32; "B"; Load_Latency; 39; "cycles"; Load_Latency; 14; "nanoseconds"; Shared_On; "SM-level"; Share_Cache_With_L1_Data; 1; Share_Cache_With_Texture; 1; Caches_Per_SM; 1
CONSTANT_L1_CACHE; Size; 2.109375; KiB; "="; Cache_Line_Size; 64; "B"; Load_Latency; 34; "cycles"; Load_Latency; 12; "nanoseconds"; Shared_On; "SM-level"; Share_Cache_With_L1_Data; 0; Caches_Per_SM; 1
CONST_L1_5_CACHE; Size; 62.500000; KiB; ">="; Cache_Line_Size; 256; "B"; Load_Latency; 121; "cycles"; Load_Latency; 44; "nanoseconds"; Shared_On; "SM-level"
MAIN_MEMORY; Size; 15.597046; GiB; "="; Load_Latency; 600; "cycles"; Load_Latency; 97; "nanoseconds"; Shared_On; "GPU-level"
SHARED_MEMORY; Size; 100.000000; KiB; "="; Load_Latency; 29; "cycles"; Load_Latency; 10; "nanoseconds"; Shared_On; "SM-level"`;
    if (!selectedAnalysisPath.value) {
        alert('No analysis selected');
        return;
    }
    const analysisFileData = await window.electronAPI.loadAnalysis(selectedAnalysisPath.value);
    const comparisonAnalysisFileData = selectedComparisonAnalysisPath.value
        ? await window.electronAPI.loadAnalysis(selectedComparisonAnalysisPath.value)
        : undefined;

    await dataStore.initialize(analysisFileData, comparisonAnalysisFileData, mt4g, mt4g);
    contextStore.setCurrentContext(CONTEXT.ANALYSIS);
}
</script>
