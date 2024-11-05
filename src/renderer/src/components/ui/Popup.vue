<template>
    <div
        v-if="activePopups.includes(type)"
        class="absolute inset-0 flex flex-col items-center justify-center"
        :style="getStyle()"
    >
        <div class="flex h-min max-h-full w-full flex-col rounded bg-background outline outline-1 outline-text">
            <div
                class="flex h-8 w-full flex-row items-center justify-between border-b border-text bg-background pl-2 text-text"
            >
                <p>{{ title }}</p>
                <button class="h-full w-14 bg-red-400 text-white" @click="close">X</button>
            </div>
            <div class="h-full w-full overflow-y-auto">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useContextStore } from '../../stores/ContextStore';

const props = defineProps({
    type: Number,
    title: String,
    distanceX: String,
    distanceY: String,
    onOpen: Function
});

defineExpose({ close });

const contextStore = useContextStore();
const activePopups = computed(() => contextStore.getActivePopups);
const openPopups = ref([]);

// Open the popup when it's identifier gets added to the activePopups array
watch(
    () => activePopups.value,
    (newValue) => {
        if (newValue.includes(props.type) && !openPopups.value.includes(props.type)) {
            if (props.onOpen) {
                props.onOpen();
            }
            openPopups.value.push(props.type);
        } else if (openPopups.value.includes(props.type) && !newValue.includes(props.type)) {
            openPopups.value.splice(openPopups.value.indexOf(props.type), 1);
        }
    },
    { deep: true }
);

/**
 * Close the popup
 */
function close() {
    contextStore.togglePopup(props.type, false);
}

/**
 * Get the styles to size the popup correctly based on the provided parameters
 */
function getStyle() {
    return {
        zIndex: 50 + activePopups.value.indexOf(props.type) * 10,
        paddingLeft: props.distanceX ? props.distanceX : '25vw',
        paddingRight: props.distanceX ? props.distanceX : '25vw',
        paddingTop: props.distanceY ? props.distanceY : '25vh',
        paddingBottom: props.distanceY ? props.distanceY : '25vh'
    };
}
</script>
