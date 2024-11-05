import { dialog } from 'electron';

/**
 * @param event
 * @param defaultPath The default path to open the folder picker on
 * @returns {Promise<string|string>} The path to the selected folder
 */
export async function selectDirectory(event, defaultPath) {
    const result = await dialog.showOpenDialog(undefined, {
        properties: ['openDirectory'],
        defaultPath: defaultPath
    });
    return result['filePaths'][0] || '';
}

/**
 * @param event
 * @param filters Filters to apply to the file picker
 * @returns {Promise<string|string>} The path to the selected file
 */
export async function selectFile(event, filters) {
    const result = await dialog.showOpenDialog(undefined, {
        filters: filters
    });
    return result['filePaths'][0] || '';
}
