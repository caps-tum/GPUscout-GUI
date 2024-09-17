// These paths are all relative to the userData directory
// Linux: ~/.config/gpuscout-gui
// Windows: %APPDATA%/gpuscout-gui
// MacOS: ~/Library/Application Support/gpuscout-gui

export const SAVED_ANALYSES_DATA_PATH = 'analyses/';
export const SAVED_ANALYSES_CONFIG_PATH = 'recent_analyses.json';
export const APP_CONFIG_PATH = 'config.json';

export const NECESSARY_ANALYSIS_FILES = [
    'result-ANALYSIS.json',
    'nvdisasm-executable-ANALYSIS-sass.txt',
    'nvdisasm-registers-executable-ANALYSIS-sass.txt',
    'nvdisasm-executable-ANALYSIS-ptx.txt',
    'sources/ANALYSIS/'
];
