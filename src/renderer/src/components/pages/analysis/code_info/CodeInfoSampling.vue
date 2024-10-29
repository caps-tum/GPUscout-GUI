<template>
    <div class="flex flex-col space-y-1 p-1">
        <ButtonMetric
            metric="Total Samples"
            :value="`${formatNumber(totalLineStalls)} / ${formatNumber(stalls['total'])} (${formatPercent((totalLineStalls / stalls['total']) * 100)})`"
        />
        <template v-for="stall of Object.keys(stalls).sort((a, b) => stalls[b] - stalls[a])" :key="stall">
            <ButtonMetric
                v-if="stall !== 'total'"
                class="*:!bg-secondary *:text-text"
                :metric="stall"
                :value="stalls[stall]"
                :absolute-value="(stalls[stall] / totalLineStalls) * 100"
            />
        </template>
    </div>
</template>
<script setup>
import { computed } from 'vue';
import ButtonMetric from '../../../ui/buttons/ButtonMetric.vue';
import { formatNumber, formatPercent } from '../../../../utils/formatters';

const props = defineProps({
    stalls: Object
});

const totalLineStalls = computed(() => Object.values(props.stalls).reduce((a, b) => a + b, 0) - props.stalls['total']);
</script>
