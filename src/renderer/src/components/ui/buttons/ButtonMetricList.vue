<template>
    <div class="shrink-0">
        <a class="flex h-full flex-row justify-between space-x-2 rounded bg-primary p-2 py-1 text-background">
            <p class="line-clamp-2 min-w-12">{{ data.display_name }}</p>
            <div class="flex grow flex-row items-center justify-end text-sm">
                <p v-if="comparisonValue !== undefined" class="text-center">
                    {{ data.format_function(comparisonValue, comparisonSecondaryValue) }}
                </p>
                <p v-if="comparisonValue !== undefined" class="px-1">vs</p>
                <p class="text-center">
                    {{ data.format_function(value, secondaryValue) }}
                </p>
            </div>
        </a>
    </div>
</template>
<script setup>
import { getMetricsData } from '../../../utils/formatters';

const props = defineProps({
    metric: String,
    value: [Number, String],
    comparisonValue: [Number, String],
    hint: String,
    secondaryValue: Number,
    comparisonSecondaryValue: Number
});

const data = getMetricsData(props.metric);
</script>
