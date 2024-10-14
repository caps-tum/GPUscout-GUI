<template>
    <template v-for="arrow in arrows" :key="arrow">
        <div v-if="(arrows % 2 === 1 && arrows !== 1) || (spaceTop !== undefined && arrow <= spaceTop)" class=""></div>
        <div class="arrow-right relative grid grid-cols-1 grid-rows-[50%_50%] flex-col">
            <div class="flex flex-col justify-end border-b border-black pb-1 text-center text-sm text-text">
                <slot :name="'arrow-' + arrow + '-top'"></slot>
            </div>
            <div class="flex flex-col justify-start border-t border-black pt-1 text-center text-sm text-text">
                <slot :name="'arrow-' + arrow + '-bottom'"></slot>
            </div>
        </div>
        <div v-if="arrows % 2 === 0 && arrow !== arrows" class=""></div>
    </template>
</template>
<script setup>
defineProps({
    arrows: Number,
    spaceTop: Number
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
