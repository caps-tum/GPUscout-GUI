import MetricSection from '../renderer/src/components/ui/sections/MetricSection.vue';
import { ANALYSIS } from './analyses';

/**
 * This object contains the definitions of all memory graphs for different analyses. Configuration is as follows:
 * - Each memory graph is a list, with each list entry defining one column of the memory graph
 * - Each column definition is also a list, with each list entry defining a graph element (nodes or arrows)
 * - Graph elements are defined as follows:
 *   - Small graph nodes: Marked with the "size: 'small'" attribute. The title and bold attributes specify the text of the node as well as if this text should be bold
 *   - Large graph nodes: If none of the entries of a column definition has the "size: 'small'" attribute, they are merged into one large node, with the text of the individual nodes being displayed from top to bottom.
 *     Entries can have either a title attribute specifying text (again bold or not), or be formatted depending on a metric value.
 *     When formatting using metric values, the metric attribute specifies the name of the metric to use, with the format and comparison_format attributes specifying the format string the metric values get inserted into ({0} for the current metric value, {1} for the comparison metric value, {2} for an arrow indicating the difference of both).
 *   - The first and last column of a memory graph have to contain nodes, with every other column being interpreted as arrows. Arrow nodes can have either a title or metric associated with them.
 */
export const MEMORY_GRAPH_DEFINITION = {
    global_local_caches: [
        [{ title: 'Kernel', bold: true }],
        [
            {
                metric: ANALYSIS.register_spilling.metrics.global_loads_count
            },
            { title: 'TODO Inst.' }
        ],
        [
            { title: 'Global Memory', size: 'small', bold: true },
            { title: 'Local Memory', bold: true }
        ],
        [
            { metric: ANALYSIS.register_spilling.metrics.global_memory_to_l1_bytes },
            { metric: ANALYSIS.register_spilling.metrics.local_memory_to_l1_bytes }
        ],
        [
            {
                metric: ANALYSIS.register_spilling.metrics.global_memory_to_l1_cache_miss_percent,
                format: '{0} miss rate',
                comparison_format: '{0}\nmiss rate\n{1}'
            },
            { title: 'L1 Cache', bold: true },
            {
                metric: ANALYSIS.register_spilling.metrics.local_memory_to_l1_cache_miss_percent,
                format: '{0} miss rate',
                comparison_format: '{0}\nmiss rate\n{1}'
            }
        ],
        [
            { metric: ANALYSIS.register_spilling.metrics.global_memory_l1_to_l2_bytes },
            { metric: ANALYSIS.register_spilling.metrics.local_memory_l1_to_l2_bytes }
        ],
        [
            { title: 'L2 Cache', bold: true },
            {
                metric: ANALYSIS.register_spilling.metrics.l1_to_l2_cache_miss_percent,
                format: '{0} miss rate',
                comparison_format: '{0}\nmiss rate\n{2} {1}'
            }
        ],
        [{ metric: ANALYSIS.register_spilling.metrics.l2_to_dram_bytes }],
        [{ title: 'DRAM', bold: true }]
    ],
    texture_memory: [
        [{ title: 'Kernel', bold: true }],
        [
            { metric: ANALYSIS.use_texture.metrics.kernel_to_texture_memory_instruction_count },
            { metric: ANALYSIS.register_spilling.metrics.global_loads_count }
        ],
        [
            { title: 'Texture Memory', bold: true, size: 'small' },
            { title: 'Global Memory', bold: true, size: 'small' }
        ],
        [
            { metric: ANALYSIS.use_texture.metrics.texture_memory_to_l1_bytes },
            { metric: ANALYSIS.register_spilling.metrics.global_memory_to_l1_bytes }
        ],
        [
            {
                metric: ANALYSIS.use_texture.metrics.texture_memory_to_l1_cache_miss_percent,
                format: '{0} miss rate',
                comparison_format: '{0}\nmiss rate\n{1}'
            },
            { title: 'L1 Cache', bold: true },
            {
                metric: ANALYSIS.register_spilling.metrics.global_memory_to_l1_cache_miss_percent,
                format: '{0} miss rate',
                comparison_format: '{0}\nmiss rate\n{1}'
            }
        ],
        [
            { metric: ANALYSIS.use_texture.metrics.l1_to_l2_bytes },
            { metric: ANALYSIS.register_spilling.metrics.global_memory_l1_to_l2_bytes }
        ],
        [
            {
                metric: ANALYSIS.use_texture.metrics.l1_to_l2_cache_miss_percent,
                format: '{0} miss rate',
                comparison_format: '{0}\nmiss rate\n{1}'
            },
            { title: 'L2 Cache', bold: true },
            {
                metric: ANALYSIS.register_spilling.metrics.global_memory_to_l1_cache_miss_percent,
                format: '{0} miss rate',
                comparison_format: '{0}\nmiss rate\n{1}'
            }
        ],
        [{ metric: ANALYSIS.use_texture.metrics.l2_to_dram_bytes }],
        [{ title: 'DRAM', bold: true }]
    ],
    atomics: [
        [{ title: 'Global Memory', bold: true }],
        [
            {
                metric: ANALYSIS.global_atomics.metrics.global_memory_to_l1_red_atom_bytes
            }
        ],
        [
            { title: 'L1 Cache', bold: true },
            {
                metric: ANALYSIS.global_atomics.metrics.global_memory_to_l1_cache_miss_percent,
                format: '{0} miss rate',
                comparison_format: '{0}\nmiss rate\n{1}'
            }
        ],
        [{ metric: ANALYSIS.global_atomics.metrics.l1_to_l2_bytes }],
        [
            { title: 'L2 Cache', bold: true },
            {
                metric: ANALYSIS.global_atomics.metrics.l1_to_l2_cache_miss_percent,
                format: '{0} miss rate',
                comparison_format: '{0}\nmiss rate\n{1}'
            }
        ],
        [{ metric: ANALYSIS.global_atomics.metrics.l2_to_dram_bytes }],
        [{ title: 'DRAM', bold: true }]
    ],
    global_caches: [
        [{ title: 'Kernel', bold: true }],
        [
            {
                metric: ANALYSIS.register_spilling.metrics.global_loads_count
            }
        ],
        [{ title: 'Global Memory', size: 'small', bold: true }],
        [{ metric: ANALYSIS.register_spilling.metrics.global_memory_to_l1_bytes }],
        [
            { title: 'L1 Cache', bold: true },
            {
                metric: ANALYSIS.register_spilling.metrics.global_memory_to_l1_cache_miss_percent,
                format: '{0} miss rate',
                comparison_format: '{0}\nmiss rate\n{1}'
            }
        ],
        [{ metric: ANALYSIS.register_spilling.metrics.global_memory_l1_to_l2_bytes }],
        [
            { title: 'L2 Cache', bold: true },
            {
                metric: ANALYSIS.register_spilling.metrics.l1_to_l2_cache_miss_percent,
                format: '{0} miss rate',
                comparison_format: '{0}\nmiss rate\n{2} {1}'
            }
        ],
        [{ metric: ANALYSIS.register_spilling.metrics.l2_to_dram_bytes }],
        [{ title: 'DRAM', bold: true }]
    ]
};
