export const TEXT = {
    analyses: {
        general: {
            code_info: {
                no_line_selected: 'No line selected',
                no_info:
                    'No information available for this line. Select a highlighted line in the code to get further information'
            },
            warp_stall_analysis: {
                title: 'Warp stall analysis',
                hint: 'Warp stall analysis hint'
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
                }
            }
        }
    }
};
