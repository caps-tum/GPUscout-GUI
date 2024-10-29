import { ANALYSIS } from './analyses';

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
                comparison_format: '{0}\nmiss rate\n{1}'
            }
        ],
        [{ metric: ANALYSIS.register_spilling.metrics.l2_to_dram_bytes }],
        [{ title: 'DRAM', bold: true }]
    ],
    texture_memory: [
        [{ title: 'Kernel', bold: true }],
        [{ metric: ANALYSIS.use_texture.metrics.kernel_to_texture_memory_instruction_count }],
        [{ title: 'Texture Memory', bold: true }],
        [{ metric: ANALYSIS.use_texture.metrics.texture_memory_to_l1_bytes }],
        [
            { title: 'L1 Cache', bold: true },
            {
                metric: ANALYSIS.use_texture.metrics.texture_memory_to_l1_cache_miss_percent,
                format: '{0} miss rate',
                comparison_format: '{0}\nmiss rate\n{1}'
            }
        ],
        [{ metric: ANALYSIS.use_texture.metrics.l1_to_l2_bytes }],
        [
            { title: 'L2 Cache', bold: true },
            {
                metric: ANALYSIS.use_texture.metrics.l1_to_l2_cache_miss_percent,
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
    ]
};
