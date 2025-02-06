/**
 * @module
 * @author Tobias Stuckenberger
 * @description This module contains the all of the texts displayed in the UI allowing for easy modification without having to search the entire codebase.
 */

import { HELP_TEXTS } from './help_texts';

/**
 * An object containing all texts displayed in the ui
 */
export const TEXT = {
    landing_page: {
        select_result: {
            title: '1. Select GPUscout result to analyze:',
            hint: 'This should correspond to the newest result available.'
        },
        select_comparison_result: {
            title: '2. Select a GPUscout result to compare to (optional):',
            hint: 'This could be an older version of the same kernel, or a version run on different hardware.'
        },
        select_topology_result: {
            title: 'Select memory topology (optional):',
            hint: 'The topology file will add GPU-specific information to graphs.',
            hint2: 'Adding a second topology file is only necessary in case different hardware was used.'
        },
        select_folder: {
            title: 'Select analysis in GPUscout output directory',
            hint: 'This list contains all GPUscout result files found in the selected folder'
        },
        select_file: {
            not_selected: 'Choose GPUscout result file',
            selected: 'Selected analysis file: {0}'
        },
        select_topology: {
            not_selected: 'Choose memory topology result file',
            selected: 'Selected memory topology file: {0}'
        },
        error_messages: {
            no_analysis: 'Please select a result file to proceed',
            duplicate_analysis: 'Please select different result files to proceed'
        }
    },
    navigation: {
        comparison_titles: {
            only_current: 'Analyses only in current result:',
            only_original: 'Analyses only in original result:',
            both: 'Analyses in both results:'
        },
        analyses_title: 'Relevant analyses:'
    },
    code_view: {
        title: 'Code Comparison',
        hint: 'Compare the source code with intermediary PTX or SASS representations.',
        toggle: {
            old: 'Original kernel',
            new: 'Current kernel'
        },
        code_info: {
            default_occurrence_title: 'Occurrence found',
            stalls_title: 'PC Sampling Stalls',
            recommendations_title: 'Recommendations',
            multiple_selected_info:
                'You have currently selected multiple occurrences. To get further insights into one of them, click on one of the highlighted lines in the intermediary representation.'
        },
        help_texts: {
            live_registers: {
                title: 'Live Registers',
                help_text: HELP_TEXTS.registers
            }
        }
    },
    summary: {
        toggle: {
            sass: 'SASS Code',
            ptx: 'PTX Code'
        }
    },
    top_section: {
        title: 'Relevant Kernel Metrics',
        title_comparison: 'Relevant Kernel Metrics (Original vs current kernel)',
        hint: 'The following metrics are relevant for the current analysis.'
    },
    analyses: {
        general: {
            code_info: {
                no_line_selected: `No line selected.
Select a line highlighted in red or blue to get information about findings in that line.
Lines highlighted in blue correspond to general information, while lines marked in red contain optimizations for potential performance bottlenecks.`,
                source_occurrence_selected:
                    'One or more occurrences found for the currently selected source code line. Select one of the highlighted code lines in the intermediary representation to get further information.',
                no_info: `No information available for the selected line(s).
Select a highlighted line in the code to get further information.
Lines highlighted in blue correspond to general information, while lines marked in red contain optimizations for potential performance bottlenecks.`
            },
            warp_stall_analysis: {
                title: 'Warp stall analysis',
                hint: 'Occurrences of relevant warp stalls in the kernel',
                help_strings: {
                    total_stalls: 'The total number of stalls should be kept as low as possible'
                }
            },
            metrics: {
                title: 'Metrics'
            }
        },
        datatype_conversion: {
            top_section: {
                memory_graph: {
                    title: 'Global Loads'
                },
                conversion_numbers: {
                    title: 'Datytype conversions found:',
                    hint: 'These values represent the total amount of datatype conversations found in the current kernel and should be kept as low as possible.',
                    type: {
                        total: {
                            title: 'Total',
                            hint: 'Total number of conversions'
                        },
                        f2f: {
                            title: 'F2F',
                            hint: 'Float-to-Float conversions'
                        },
                        i2f: {
                            title: 'I2F',
                            hint: 'Integer-to-Float converions'
                        },
                        f2i: {
                            title: 'F2I',
                            hint: 'Float-to-Integer conversions'
                        }
                    }
                }
            }
        },
        global_atomics: {
            top_section: {
                memory_graph: {
                    title: 'Memory graph'
                },
                atomics_usage: {
                    title: 'Atomics usage',
                    hint: 'Current usage of global and shared atomics in the kernel'
                }
            }
        },
        use_texture: {
            top_section: {
                usage: {
                    yes: 'Texture memory is currently used in the kernel',
                    no: 'Texture memory is not currently used in the kernel'
                },
                memory_graph: {
                    title: 'Texture Loads'
                }
            }
        },
        vectorization: {
            top_section: {
                load_analysis: {
                    title: 'Load analysis',
                    hint: 'Usage of (load) instructions in the kernel.'
                }
            }
        },
        register_spilling: {
            top_section: {
                memory_graph: {
                    title: 'Global & Local Loads'
                },
                lmem_impact: {
                    title: 'Performance impact of local memory',
                    hint: 'Registers are spilled to local memory, which can degrade performance. High values in any of the following categories indicate optimization potential',
                    type: {
                        bandwidth: {
                            title: 'LMEM Bandwidth impact',
                            hint: 'Percentage of queries issued due to LMEM'
                        },
                        instruction: {
                            title: 'LMEM Instruction impact',
                            hint: 'Perccentage of instructions issued due to LMEM'
                        }
                    }
                }
            }
        },
        use_shared: {
            top_section: {
                shared_usage: {
                    title: 'Current usage of shared memory',
                    hint: 'A summary of the current usage of shared memory. Escpecially bank conflicts should be resolved before continuing'
                }
            }
        }
    }
};
