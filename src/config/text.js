export const TEXT = {
    code_view: {
        code_info: {
            default_occurrence_title: 'Occurrence found'
        }
    },
    analyses: {
        general: {
            code_info: {
                no_line_selected: 'No line selected',
                source_occurrence_selected:
                    'One or more occurrences found for the currently selected source code line. Select one of the highlighted code lines in the binary code to get further information.',
                no_info:
                    'No information available for this line. Select a highlighted line in the code to get further information'
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
                conversion_numbers: {
                    title: 'Number of datytype conversions found:',
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
                lmem_impact: {
                    title: 'Performance impact of local memory',
                    hint: 'Registers are spilled to local memory, which can degrade performance. High values in any of the following categories indicate optimization potential',
                    type: {
                        bandwidth: {
                            title: 'Bandwidth',
                            hint: 'Percentage of queries that are issued due to local memory accesses'
                        },
                        instruction: {
                            title: 'Instructions',
                            hint: 'Perccentage of instructions that are issued due to local memory accesses'
                        }
                    }
                }
            }
        }
    }
};
