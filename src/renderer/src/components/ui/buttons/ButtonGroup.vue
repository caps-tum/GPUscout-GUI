<!--
Component for a button group (currently unused)

Author: Tobias Stuckenberger
-->
<template>
    <div
        class="grid grid-rows-1 gap-x-[1px] rounded"
        :style="{ 'grid-template-columns': 'repeat(' + slots + ', minmax(0, 1fr))' }"
    >
        <a
            v-for="slot in slots"
            :key="slot"
            class="flex cursor-pointer flex-col items-center justify-center bg-primary p-2 text-background first:rounded-l last:rounded-r"
            :class="getActiveButtonStyle(slot)"
            @click="() => onClickButton(slot)"
        >
            <slot :name="'button-' + slot"></slot>
        </a>
    </div>
</template>
<script setup>
const props = defineProps({
    slots: Number,
    activeSlot: Number
});

const emit = defineEmits(['slotActivated']);

function getActiveButtonStyle(slot) {
    return slot === props.activeSlot ? 'bg-primary text-background' : '';
}

function onClickButton(slot) {
    emit('slotActivated', slot);
}
</script>
