/**
 * @module
 * @author Tobias Stuckenberger
 * @description This module contains all functions related to os file handling
 */
import { app } from 'electron';
import { join } from 'path';
import * as fs from 'node:fs';
import { APP_CONFIG_PATH } from '../config/files';

/**
 * Reads the content of a folder
 * @param {Event} event
 * @param {String} folderPath The path to a folder
 * @returns {Promise.<Array>} The files inside that folder
 */
export async function getFolderContent(event, folderPath) {
    if (!fs.existsSync(folderPath)) {
        return [];
    }
    return await fs.promises.readdir(folderPath);
}

/**
 * Check or create config file structure
 * @returns {Promise<void>}
 */
export async function checkFileStructure() {
    const dataPath = app.getPath('userData');
    const configFilePath = join(dataPath, APP_CONFIG_PATH);

    if (!fs.existsSync(configFilePath)) {
        await fs.promises.writeFile(configFilePath, '{}');
    }
}

/**
 * Reads the config file
 * @returns {Promise<String>} The config file content
 */
export async function getConfig() {
    const configFilePath = join(app.getPath('userData'), APP_CONFIG_PATH);
    return await fs.promises.readFile(configFilePath, { encoding: 'utf8' });
}

/**
 * Set the content of the contig file
 * @param {Event} event
 * @param {String} content The new content of the config file
 * @returns {Promise<void>}
 */
export async function setConfig(event, content) {
    const configFilePath = join(app.getPath('userData'), APP_CONFIG_PATH);
    return await fs.promises.writeFile(configFilePath, content, { encoding: 'utf8' });
}

/**
 * Get the names of all valid GPUscour result files in a folder
 * @param {Event} event
 * @param {String} folderPath The path to a folder
 * @returns {Promise<String[]>} All GPUscout related files in that folder
 */
export async function getAnalysesInFolder(event, folderPath) {
    const folderContent = await getFolderContent(event, folderPath);
    const analysisTitles = folderContent.filter((file) => file.endsWith('.json')).map((file) => file.replace('.json', ''));

    return analysisTitles;
}

/**
 * Read a file
 * @param {Event} event
 * @param {String} filePath The path to a file
 * @returns {Promise<String>} The content of that file
 */
export async function getFileContent(event, filePath) {
    return await fs.promises.readFile(filePath, {
        encoding: 'utf8'
    });
}
