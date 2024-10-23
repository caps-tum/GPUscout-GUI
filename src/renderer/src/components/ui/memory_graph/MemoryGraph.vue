<template>
    <div class="rounded bg-secondary/50 p-2">
        <div class="flex flex-row justify-between">
            <p class="pr-6 text-lg">{{ title }}</p>
            <ButtonHelp class="text-text" />
        </div>
        <div class="grid grid-flow-col" :style="getGridStyle()">
            <slot></slot>
        </div>
        <p class="text-sm text-text/50">{{ hint }}</p>
    </div>
</template>
<script setup>
import ButtonHelp from '../buttons/ButtonHelp.vue';

const props = defineProps({
    verticalNodes: Number,
    horizontalNodes: Number,
    title: String,
    hint: String
});

function getGridStyle() {
    let columnTemplate = '';
    for (let i = 0; i < props.horizontalNodes; i++) {
        columnTemplate += ' min-content';
        if (i < props.horizontalNodes - 1) {
            columnTemplate += ' auto';
        }
    }

    let rowTemplate = '';
    for (let i = 0; i < props.verticalNodes * 2 - 1; i++) {
        if (i === props.verticalNodes * 2 - 2) {
            rowTemplate += ' 1fr [last-line]';
        } else {
            rowTemplate += ' 1fr';
        }
    }

    return {
        'grid-template-columns': columnTemplate.trim(),
        'grid-template-rows': rowTemplate.trim()
    };
}
</script>
