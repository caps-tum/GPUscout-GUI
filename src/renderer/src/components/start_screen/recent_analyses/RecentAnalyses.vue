<template>
    <div class="rounded bg-blue-400 p-2">
        <p class="text-lg">Select recent analysis</p>
        <input type="text" class="mb-1 w-full rounded p-1" placeholder="Search..." />
        <ul class="max-h-72 space-y-1 overflow-y-auto">
            <li v-for="x in 15" :key="x" class="flex cursor-pointer flex-col rounded bg-blue-100 p-1">
                <p>Title of the Analysis</p>
                <p class="text-sm">2 Kernels - 3 Recommendations</p>
            </li>
        </ul>
    </div>
</template>
<script setup></script>
