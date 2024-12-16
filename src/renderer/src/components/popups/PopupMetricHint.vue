<!--
Component for the help popup opened when clicking on the help icon of anything.

Author: Tobias Stuckenberger
-->
<template>
    <Popup :type="POPUP.METRIC_HELP" :title="parameters.metricName">
        <div class="whitespace-pre-line p-2" v-html="parameters.helpText"></div>
    </Popup>
</template>
<script setup>
import { computed } from 'vue';
import { POPUP, useContextStore } from '../../stores/ContextStore';
import Popup from '../ui/Popup.vue';

const contextStore = useContextStore();

const parameters = computed(() => contextStore.getPopupParameters);
</script>
