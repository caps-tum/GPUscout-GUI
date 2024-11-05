import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useConfigStore = defineStore('config', () => {
    const config = ref({});

    const getConfig = computed(() => config.value);

    /**
     * Load the config from electron
     */
    async function initialize() {
        const loadedConfig = await window.electronAPI.getConfig();
        config.value = JSON.parse(loadedConfig);
    }

    /**
     * Change a config option
     * @param {String} option The name of the option to change
     * @param {String} value The new value of the option
     */
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
