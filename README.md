# GPUscout-GUI

A companion visual user interface for analyzing and understanding findingd made by [GPUscout](https://github.com/caps-tum/GPUscout).

GPUscout-GUI provides a graphical representation of analysis results computed by the [GPUscout](https://github.com/caps-tum/GPUscout) application. Users are able to view kernel-wide metrics, compare the kernel source and intermediate codes, and investigate findings in more detail than only using GPUscout's output. Optionally, users can add GPU topology information through [MT4G](https://github.com/caps-tum/mt4g).

## Compatibilty Matrix

| GPUscout-GUI version | GPUscout version range | MT4G version range | Notes |
|---|:---:|:---:|:---:|
|0.1.0 | >= 0.3.0 | <= 0.1.0 | NVIDIA-only GPUscout, NVIDIA-only GUI, NVIDIA-only and CSV-based MT4G |

## Building and Running
### Requirements
- [NodeJS](https://nodejs.org/en) (23.9.0+)
- NPM (11.1.0+)

### Installation
```bash
npm install

# run one of the following commands to build the executable and installer. Building can only be done for the os currently in use.
npm run build:linux # build for linux
npm run build:mac # build for mac
npm run build:win # build for windows
```
The resulting executable will be located inside the generated `dist` folder

### Run Development Server
```bash
npm run dev
```

## Project structure

GPUscout-GUI uses both the [electron](https://www.electronjs.org/) and [vueJS](https://vuejs.org/) frameworks to create the user interface as a standalone application.
The only relevant folders in the root directory are:
- dist: Generated executables are located here
- src: Contains the source code of the application.

### Source Code Directories

The `src` directory is split into four modules:
- config: Contains configuration files for all aspects of the UI. Used to add/remove/modify metrics, analyses, texts, colors, ...
- main: Contains code related to the electron framework. Does not need to be modified further
- preload: Contains code connecting the electron backend to the frontend. Does not need to be modified further.
- renderer: Contains the definition and source code of the user interface. New features need to be implemented here. `src/components` Defines all components visible in the user interface, organized by page. `src/stores` defines Vue stores, which handle reactive data accessible from all components (Modifications here should be made carefully). `src/utils` defines all JS classes used in the code.

## About
GPUscout-GUI has been initially developed by Tobias Struckenberger, and is further maintained by Stepan Vanecek (stepan.vanecek(at)tum.de) and the [CAPS TUM](https://www.ce.cit.tum.de/en/caps/homepage/). Please contact us in case of questions, bug reporting etc.

GPUscout-GUI is available under the Apache-2.0 license. (see [License](https://github.com/caps-tum/sys-sage/blob/master/LICENSE))
