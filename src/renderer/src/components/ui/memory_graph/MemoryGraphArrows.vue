<template>
    <template v-for="(title, index) of labels" :key="title">
        <div v-if="(labels.length % 2 === 1 && labels.length !== 1) || labels.length * 2 <= rows" class=""></div>
        <div class="arrow-right relative grid grid-cols-1 grid-rows-[50%_50%] flex-col">
            <div class="flex flex-col justify-end border-b border-black px-2 pb-1 text-center text-sm text-text">
                {{ title }}
            </div>
            <div
                v-if="comparisonLabels"
                class="flex flex-col justify-start border-t border-black px-2 pt-1 text-center text-sm text-text"
            >
                {{ comparisonLabels[index] }}
            </div>
        </div>
        <div v-if="labels.length % 2 === 0 && index !== labels.length - 1" class=""></div>
    </template>
</template>
<script setup>
defineProps({
    labels: Array,
    comparisonLabels: Array,
    rows: Number
});
</script>
<style scoped>
/*
 * With modifications taken from
 * https://stackoverflow.com/questions/45030914/how-to-put-arrow-between-two-divs-using-html-and-css
 */
.arrow-right:after {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    top: 50%;
    border-style: solid;
    border-width: 7px 0 7px 20px;
    border-color: transparent transparent transparent black;
    right: 0;
    transform: translate(1px, -50%);
}
</style>
