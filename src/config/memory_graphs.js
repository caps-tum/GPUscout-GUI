import MetricSection from '../renderer/src/components/ui/sections/MetricSection.vue';
import { ANALYSIS } from './analyses';
import { METRICS } from './metrics';

/**
 * This object contains the definitions of all memory graphs for different analyses. Configuration is as follows:
 * - Each memory graph is a list, with each list entry defining one column of the memory graph
 * - Each column definition is also a list, with each list entry defining a graph element (nodes or arrows)
 * - Graph elements are defined as follows:
 *   - Small graph nodes: Marked with the "size: 'small'" attribute. The title and bold attributes specify the text of the node as well as if this text should be bold
 *   - Large graph nodes: If none of the entries of a column definition has the "size: 'small'" attribute, they are merged into one large node, with the text of the individual nodes being displayed from top to bottom.
 *     Entries can have either a title attribute specifying text (again bold or not), or be formatted depending on a metric value.
 *     When formatting using metric values, the metric attribute specifies the name of the metric to use, with the format and comparison_format attributes specifying the format string the metric values get inserted into ({value} for the current metric value, {comp_value} for the comparison metric value, {diff_arrow} for an arrow indicating the difference of both).
 *   - The first and last column of a memory graph have to contain nodes, with every other column being interpreted as arrows. Arrow nodes can have either a title or metric associated with them.
 */
export const MEMORY_GRAPH_DEFINITION = {
    global_local_caches: [
        [{ title: 'Kernel', bold: true }],
        [
            {
                metric: METRICS.instructions_global_loads.name
            },
            { metric: METRICS.instructions_local_loads.name }
        ],
        [
            { title: 'Global Memory', size: 'small', bold: true },
            { title: 'Local Memory', bold: true }
        ],
        [{ metric: METRICS.load_data_global_to_l1_bytes.name }, { metric: METRICS.load_data_local_to_l1_bytes.name }],
        [
            {
                metric: METRICS.load_data_global_to_l1_cache_miss_perc.name,
                format: '{value} miss rate',
                comparison_format: '{value}\nmiss rate\n{comp_value}'
            },
            { title: 'L1 Cache {size}', bold: true },
            {
                metric: METRICS.load_data_local_to_l1_cache_miss_perc.name,
                format: '{value} miss rate',
                comparison_format: '{value}\nmiss rate\n{comp_value}'
            }
        ],
        [{ metric: METRICS.load_data_global_l1_to_l2_bytes.name }, { metric: METRICS.load_data_local_l1_to_l2_bytes.name }],
        [
            { title: 'L2 Cache {size}', bold: true },
            {
                metric: METRICS.load_data_l1_to_l2_cache_miss_perc.name,
                format: '{value} miss rate',
                comparison_format: '{value}\nmiss rate\n{diff_arrow} {comp_value}'
            }
        ],
        [{ metric: METRICS.load_data_l2_to_dram_bytes.name }],
        [{ title: 'DRAM {size}', bold: true }]
    ],
    texture_memory: [
        [{ title: 'Kernel', bold: true }],
        [{ metric: METRICS.texture_data_kernel_to_tex_instr.name }, { metric: METRICS.instructions_global_loads.name }],
        [
            { title: 'Texture Memory', bold: true, size: 'small' },
            { title: 'Global Memory', bold: true, size: 'small' }
        ],
        [{ metric: METRICS.texture_data_tex_to_l1_bytes.name }, { metric: METRICS.load_data_global_to_l1_bytes.name }],
        [
            {
                metric: METRICS.texture_data_tex_to_l1_cache_miss_perc.name,
                format: '{value} miss rate',
                comparison_format: '{value}\nmiss rate\n{comp_value}'
            },
            { title: 'L1 Cache {size}', bold: true },
            {
                metric: METRICS.load_data_global_to_l1_cache_miss_perc.name,
                format: '{value} miss rate',
                comparison_format: '{value}\nmiss rate\n{comp_value}'
            }
        ],
        [{ metric: METRICS.texture_data_l1_to_l2_bytes.name }, { metric: METRICS.load_data_global_l1_to_l2_bytes.name }],
        [
            {
                metric: METRICS.texture_data_l1_to_l2_cache_miss_perc.name,
                format: '{value} miss rate',
                comparison_format: '{value}\nmiss rate\n{comp_value}'
            },
            { title: 'L2 Cache {size}', bold: true },
            {
                metric: METRICS.load_data_l1_to_l2_cache_miss_perc.name,
                format: '{value} miss rate',
                comparison_format: '{value}\nmiss rate\n{comp_value}'
            }
        ],
        [{ metric: METRICS.texture_data_l2_to_dram_bytes.name }],
        [{ title: 'DRAM {size}', bold: true }]
    ],
    atomics: [
        [{ title: 'Global Memory', bold: true }],
        [
            {
                metric: METRICS.atomic_data_global_to_l1_red_atom_bytes.name
            }
        ],
        [
            { title: 'L1 Cache {size}', bold: true },
            {
                metric: METRICS.atomic_data_global_to_l1_cache_miss_perc.name,
                format: '{value} miss rate',
                comparison_format: '{value}\nmiss rate\n{comp_value}'
            }
        ],
        [{ metric: METRICS.atomic_data_l1_to_l2_bytes.name }],
        [
            { title: 'L2 Cache {size}', bold: true },
            {
                metric: METRICS.atomic_data_l1_to_l2_cache_miss_perc.name,
                format: '{value} miss rate',
                comparison_format: '{value}\nmiss rate\n{comp_value}'
            }
        ],
        [{ metric: METRICS.atomic_data_l2_to_dram_bytes.name }],
        [{ title: 'DRAM {size}', bold: true }]
    ],
    global_caches: [
        [{ title: 'Kernel', bold: true }],
        [
            {
                metric: METRICS.instructions_global_loads.name
            }
        ],
        [{ title: 'Global Memory', size: 'small', bold: true }],
        [{ metric: METRICS.load_data_global_to_l1_bytes.name }],
        [
            { title: 'L1 Cache {size}', bold: true },
            {
                metric: METRICS.load_data_global_to_l1_cache_miss_perc.name,
                format: '{value} miss rate',
                comparison_format: '{value}\nmiss rate\n{comp_value}'
            }
        ],
        [{ metric: METRICS.load_data_global_l1_to_l2_bytes.name }],
        [
            { title: 'L2 Cache {size}', bold: true },
            {
                metric: METRICS.load_data_l1_to_l2_cache_miss_perc.name,
                format: '{value} miss rate',
                comparison_format: '{value}\nmiss rate\n{diff_arrow} {comp_value}'
            }
        ],
        [{ metric: METRICS.load_data_l2_to_dram_bytes.name }],
        [{ title: 'DRAM {size}', bold: true }]
    ]
};
