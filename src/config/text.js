export const TEXT = {
    landing_page: {
        select_result_title: '1. Select GPUscout result to analyze:',
        select_comparison_result_title: '2. Select an older GPUscout result to compare to (optional):',
        select_topology_title: 'Select memory topology (optional):',
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
            both: 'Analyses only both results:'
        },
        analyses_title: 'Relevant analyses:'
    },
    code_view: {
        title: 'Code View',
        hint: 'Here you can see the source and binary code of the selected kernel',
        toggle: {
            old: 'Old Kernel',
            new: 'New Kernel'
        },
        code_info: {
            default_occurrence_title: 'Occurrence found',
            stalls_title: 'PC Sampling Stalls',
            recommendations_title: 'Recommendations',
            multiple_selected_info:
                'You have currently selected multiple occurrences. To get further insights into one of them, click on one of the highlighted lines in the binary code.'
        },
        help_texts: {
            live_registers: {
                title: 'Live Registers',
                help_text: 'bla bla'
            }
        }
    },
    summary: {
        toggle: {
            sass: 'Sass Code',
            ptx: 'PTX Code'
        }
    },
    top_section: {
        title: 'Relevant Kernel Metrics',
        title_comparison: 'Relevant Kernel Metrics (Old vs New Kernel)',
        hint: 'Here you can see all relevant kernel metrics for the selected analysis in the selected kernel'
    },
    complete_memory_graph: {
        help_text: 'This is a very long help text'
    },
    analyses: {
        general: {
            code_info: {
                no_line_selected:
                    'No line selected. Select a line with red or blue markings to get information about findings in that line. Blue marked lines correcpond to lines with general infoamrtion, while red marked lines contain optimizations for potential performance bottlenecks.',
                source_occurrence_selected:
                    'One or more occurrences found for the currently selected source code line. Select one of the highlighted code lines in the binary code to get further information.',
                no_info:
                    'No information available for the selected line(s). Select a highlighted line in the code to get further information. Blue marked lines correcpond to lines with general infoamrtion, while red marked lines contain optimizations for potential performance bottlenecks.'
            },
            warp_stall_analysis: {
                title: 'Warp stall analysis',
                hint: 'Warp stall analysis hint',
                help_strings: {
                    total_stalls: 'The total number of stalls should be kept as low as possible'
                }
            },
            metrics: {
                title: 'Metrics',
                hint: 'Important metrics'
            }
        },
        datatype_conversion: {
            top_section: {
                memory_graph: {
                    title: 'Global Loads'
                },
                conversion_numbers: {
                    title: 'Datytype conversions found:',
                    hint: 'These values represent the total amount of datatype conversations found in the current kernel. Generally, these values should be kept as low as possible.',
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
                },
                warp_stall_analysis: {
                    help_strings: {
                        short_scoreboard: 'Short scoreboard stalls should be kept as low as possible',
                        mio_throttle: 'Mio throttle stalls should be kept as low as possible',
                        tex_throttle: 'Tex throttle stalls should be kept as low as possible'
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
                    title: 'Current usage of atomics in the kernel',
                    hint: 'Some hint'
                },
                help_strings: {
                    long_scoreboard: 'Long scoreboard stalls should be kept as low as possible',
                    mio_throttle: 'Mio throttle stalls should be kept as low as possible',
                    lg_throttle: 'LG throttle stalls should be kept as low as possible'
                }
            }
        },
        use_restrict: {
            top_section: {
                help_strings: {
                    long_scoreboard: 'Long scoreboard stalls should be kept as low as possible',
                    imc_miss: 'IMC missshould be kept as low as possible'
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
                },
                help_strings: {
                    long_scoreboard: 'Long scoreboard stalls should be kept as low as possible',
                    tex_throttle: 'TEX throttle be kept as low as possible'
                }
            }
        },
        vectorization: {
            top_section: {
                load_analysis: {
                    title: 'Load analysis',
                    hint: 'Load analysis hint'
                },
                help_strings: {
                    long_scoreboard: 'Long scoreboard stalls should be kept as low as possible'
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
                            hint: 'Percentage of queries that are issued due to local memory accesses'
                        },
                        instruction: {
                            title: 'LMEM Instruction impact',
                            hint: 'Perccentage of instructions that are issued due to local memory accesses'
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
