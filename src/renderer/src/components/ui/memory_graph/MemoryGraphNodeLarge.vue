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

/**
 * Return classes to style the font boldness based on the title
 * @returns {String}
 */
function getBoldness(title) {
    return title.startsWith('*') ? 'font-bold first-line:text-base my-2' : '';
}

/**
 * Sanitize the string
 * @returns {String}
 */
function getTitle(title) {
    return title.startsWith('*') ? title.substring(1) : title;
}
</script>
