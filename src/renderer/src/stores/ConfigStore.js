import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useConfigStore = defineStore('config', () => {
    const config = ref({});

    const getConfig = computed(() => config.value);

    async function initialize() {
        const loadedConfig = await window.electronAPI.getConfig();
        config.value = JSON.parse(loadedConfig);
    }

    function setOption(option, value) {
        config.value[option] = value;
        window.electronAPI.setConfig(JSON.stringify(config.value));
    }

    return {
        initialize,
        getConfig,
        setOption
    };
});
