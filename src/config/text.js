export const TEXT = {
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
        }
    }
};
