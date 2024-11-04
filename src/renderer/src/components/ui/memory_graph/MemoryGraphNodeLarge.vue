<template>
    <div
        class="flex min-w-24 flex-col items-center justify-center whitespace-pre-line rounded bg-primary p-2 text-center text-sm text-background"
        style="grid-row: 1 / span last-line"
    >
        <template v-for="title of titles" :key="title">
            <p :class="getBoldness(title)" v-html="getTitle(title)"></p>
        </template>
    </div>
</template>
<script setup>
defineProps({
    titles: Array
});

function getBoldness(title) {
    return title.startsWith('*') ? 'font-bold text-base my-2' : '';
}

function getTitle(title) {
    return title.startsWith('*') ? title.substring(1) : title;
}
</script>
