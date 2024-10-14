<template>
    <div class="grid grid-flow-col" :style="getGridStyle()">
        <slot></slot>
    </div>
</template>
<script setup>
const props = defineProps({
    verticalNodes: Number,
    horizontalNodes: Number
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
