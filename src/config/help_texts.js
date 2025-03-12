const STALLS_MORE_INFO = `

For more information visit <a target="_blank" href="https://docs.nvidia.com/nsight-compute/ProfilingGuide/index.html#metrics-reference">https://docs.nvidia.com/nsight-compute/ProfilingGuide/index.html#metrics-reference</a>`;

export const HELP_TEXTS = {
    show_memory_graph: 'memory_graph',
    stall_imc_miss: `<b>Description</b>
This stall occurs when the current warp is waiting for an immediate constant cache (IMC) miss, which means that data requested from constant memory was not yet available in the IMC and had to be requested from the slower device memory instead.
<b>Constant cache</b>
Because accesses to different addresses from threads within the same warp are serialized, cost scales linearly with the number of unuique addresses read by all threads within a warp. This makes using constant cache most effective in situations where threads in the same warp access only few distinct locations. If all threads of a warp access the same location, then constant memory can be as fast as a register access.
<b>Steps to avoid</b>
In the SASS code, immediate constants are encoded as c[bank][offset]. To reduce the number of IMC misses, review the use of constant memory in the SASS code at the locations of these stalls. ${STALLS_MORE_INFO}`,
    stall_long_scoreboard: `<b>Description</b>
This stall occurs when the current warp is waiting for a scoreboard dependency on a previous L1TEX (local, global, surface, texture) operation (in contrast to MIO operations in short scoreboard stalls). Scoreboarding manages dependencies, ensuring that instructions are not issued until the data they need is ready. Operations involving memory loads can often take multiple cycles to complete, so later instructions depending on the loaded data can only be issued when the data is available.
<b>Instruction to blame</b>
In the SASS code, look for the instruction producing the data being waited on.
<b>Steps to avoid</b>
Generally, to reduce the number of cycles waiting on L1TEX data accesses, verify the memory access patterns are optimal for the target architecture, attempt to increase cache hit rates by increasing data locality (coalescing), or by changing the cache configuration. Moving frequently used data to shared memory can also help. ${STALLS_MORE_INFO}`,
    stall_short_scoreboard: `<b>Description</b>
This stall occurs when the current warp is waiting for a scoreboard dependency on a MIO (memory input/output) operation (in contrase to L1TEX operations in long scoreboard stalls). Scoreboarding manages dependencies, ensuring that instructions are not issued until the data they need is ready. Operations involving memory input and/or output can often take multiple cycles to complete, so later instructions depending on resulting data can only be issued when they have completed.
<b>Reasons for frequent stalls</b>
The primary reason for a high number of short scoreboard stalls are typically memory operations to shared memory. Other reasons include frequent execution of special math instructions or dynamic branching (e.g. BRX, JMX).
<b>Steps to avoid</b>
To reduce the number of short scoreboaed stalls, check if there are shared memory operations and reduce bank conflicts, if found. Assigning frequently accessed values to variables can assist the compiler in using low-latency registers instead of direct memory accesses. ${STALLS_MORE_INFO}`,
    stall_no_instructions: `<b>Description</b>
This stall occurs when the current warp is waiting to be selected to fetch an instruction or waiting on an instruction cache miss. This situation typically arises when there are dependencies between instructions, and the warp scheduler has no other work (instructions or warps) available to hide the latency.
<b>Reasons for frequent stalls</b>
A high number of these stalls is no uncommon in very short kernels with less than one full wave of work in the grid.
<b>Steps to avoid</b>
To reduce the number of no instruction stalls, avoid excessively jumping across large blocks of assembly code, as this could lead to misses in the instruction cache. ${STALLS_MORE_INFO}`,
    stall_wait: `<b>Description</b>
This stall occurs when the current warp is waiting on a fixed latency execution dependency. Typically, this stall reason should be very low and only shows up as a top contributor in already highly optimized kernels.
<b>Steps to avoid</b>
To avoid wait stalls, try increasing the number of active warps, restructuring the code, or unrolling loops with the goal of hiding instruction latencies. Switching to lower latency instructions (e.g. using fast math compiler options) should also be considered. ${STALLS_MORE_INFO}`,
    stall_lg_throttle: `<b>Description</b>
This stall occurs when the current warp is waiting for the L1 instruction queue for local and global (LG) memory operations to be not full. Typically, this stall occurs only when executing local or global memory instructions extremely frequently.
<b>Steps to avoid</b>
To avoid LG throttle stalls, avoid redundant global memory accesses. Also try to avoid using thread-local memory by checking if dynamically indexed arrays are declared in local scope, of if the kernel has excessive register pressure causing by spills. If applicable, consider combining multiple lower-width memory operations into fewer wider memory operations and try interleaving memory operations and math instructions. ${STALLS_MORE_INFO}`,
    stall_selected: `<b>Description</b>
The warp was selected by the micro scheduler and issued an instruction. ${STALLS_MORE_INFO}`,
    stall_not_selected: `<b>Description</b>
This stall occurs when the current warp is waiting to be selected to fetch an instruction or waiting on an instruction cache miss. This happend when eligible warps were not picked by the warp scheduler to issue in the current cycle, as another warp was selected.
<b>Steps to avoid</b>
High numbers of these stalls indicate there are a sufficient number of warps to cover warp latencies and the number of active warps could be reduced to possibly increase cache coherence and adta locality. ${STALLS_MORE_INFO}`,
    stall_math_pipe_throttle: `<b>Description</b>
This stall occurs when the current warp is waiting for the execution pipe to be available. This stall occurs when a specific math pipeline gets oversaturated due to all active warps executing their next instruction on it.
<b>Steps to avoid</b>
To avoid math pipe throttle stalls, the number of active warps should be increased to hide the existent latency. Changing the instructions used to utilize all available pipelines in a more balanced way can also help reduce these stalls. ${STALLS_MORE_INFO}`,
    stall_dispatch: `<b>Description</b>
This stall occurs when the current warp is waiting on a dispatch stall. This happens when a warp has an instruction ready to issue, but the dispatcher holds back issuing the warp due to other conflicts or events. ${STALLS_MORE_INFO}`,
    stall_mio_throttle: `<b>Stalls</b>
This stall occurs when the current warp is waiting for the memory input/output (MIO) instruction queue to be not full. Reasons for a saturated MIO pipeline include extreme utilization of special math instructions, dynamic branching as well as shared memory instructions.
<b>Steps to avoid</b>
To avoid mio throttle stalls, try to decrease utilization of these kinds of instructions. In the case of lots of shared memory accesses, using fewer but wider loads can reduce pipeline pressure. ${STALLS_MORE_INFO}`,
    stall_tex_throttle: `<b>Description</b>
This stall occurs when the current warp is waiting for the L1 instruction queue for texture operations to be not full. This means the L1TEX pipeline is saturated and utilized too much.
<b>Steps to avoid</b>
To avoid tex throttle stalls, try issuing fewer texture fetches, surface loads, surface stores, or decoupled math operations. If applicable, consider combining multiple lower-width memory operations into fewer wider memory operations and try interleaving memory operations and math instructions. Consider converting texture lookups or surface loads into global memory lookups. Texture can accept four threads’ requests per cycle, whereas global accepts 32 threads. ${STALLS_MORE_INFO}`,
    stall_drain: `<b>Description</b>
This stall occurs when the current warp is waiting after EXIT for all outstanding memory operations to complete so that warp's resources can be freed. This typically occurs when a lot of data is written to memory towards the end of a kernel, when no or not many warps are left to hide this latency.
<b>Steps to avoid</b>
To avoid drain stalls, make sure the memory access patterns of these store operations are optimal for the target architecture and consider parallelized data reduction, if applicable. ${STALLS_MORE_INFO}`,
    stall_branch_resolving: `<b>Description</b>
This stall occurs when the current warp is waiting for a branch target to be computed, and the warp program counter to be updated.
<b>Steps to avoid</b>
To avoid branch resolving stalls, the number of jump/branch operations, as well as general control flow divergence should be reduced, for example by reducing or coalescing conditionals in the code. ${STALLS_MORE_INFO}`,
    stall_barrier: `<b>Description</b>
This stall occurs when a warp encounters a CTA barrier and has to wait to sibling warps to finish.
<b>Steps to avoid</b>
Barrier stalls are often caused in case of diverging branches. It should also be ensured that work between warps is divided evenly. Blocks of more than 512 threads should be split with the goal of increasing eligible warps while keeping occupancy high.
 Generally, the first step should be to optimize the code up to the synchronization barrier. ${STALLS_MORE_INFO}`,
    stall: `<b>Warps and the GPU Thread Hierarchy</b>
In NVIDIA GPUs, threads are organized in groups of multiple levels. The main processing unit of the GPU are so-calles Streaming Multiprocessors (SMs), which are then partitioned into four processing blocks, called SM sub-partitions. These are the primary processing elements on each SM and contain (among others) the following units:
- A warp scheduler
- A register file
- Several Execution units, pipelines and cores (for example memory load/store units)
Lastly, threads are organized in groups of 32 into so-called warps. Warps are fundamental units of scheduling in NVIDIA's CUDA architecture, as the GPU scheduler dispatches instructions to these 32-thread warps rather than to individual threads. A SM sub-partition manages a pool of these warps (pool size depends on architecture), with the warp scheduler issuing instructions to process.
<b>Warp stalls</b>
Warps can be in several different states, for example in the eligible state, if it is ready to issue an instruction. Warp stalls happen when a warp cannot proceed with the next instruction due to some delay. This delay can be one of:
- An instruction fetch
- A memory dependency (the result of a memory instruction)
- An execution dependency (the ressult of a previous instruction)
- A synchronization barrier
When stalls occur, they are recorded and classified into one of several warp stall reasons, allowing fine-grained analysis and insight into the kernel execution. Although impossible to avoid completely, warp stalls should be held as low as possible.

More information is available at <a target="_blank" href="https://docs.nvidia.com/nsight-compute/ProfilingGuide/index.html#hardware-model">https://docs.nvidia.com/nsight-compute/ProfilingGuide/index.html#hardware-model</a>`,
    occupancy: `Occupancy defines the ratio of active warps on a Streaming Multiprocessor (SM) to the maximum number of warps that the SM could support. It can also be interpreted as the percentage of the hardware's ability to proccess the warps that are actively in use.
<b>Performance Considerations</b>
While high occupancy is generally beneficial, it should not be used solely to determine the performance of a kernel. In can however be used as an indicator to the ability to hide memory latencies. Especially in memory-bound kernels, the ability to switch between warps while waiting for memory operations to complete is crucial for performance and reflected by occupancy.

More information is available at <a target="_blank" href="https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#maximize-utilization">https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#maximize-utilization</a>`,
    global_atomics: `Global atomics are atomic operations that operate on data in global memory, while ensuring that multiple threads can safely update data without introducing race conditions and thus are essential when working with shared data among parallel threads.
<b>Atomic Operations</b>
Global atomic operations perform a read-modify-write on a 32-, 64, or 128-bit word in global memory as a single, invdivisible operation. Common atomic operations are available for arithmetic operations (atomicAdd, atomicSub, atomicExch), bitwise operations (atomicAnd, atomicOr, atomicXor) and comparison operations (atomicMin, atomicMax, atomicCAS).
<b>Performance Considerations</b>
Due to their nature, atomics can serialize thread execution, as only a single thread can update a variable at a time. As global memory is visible to all threads in the kernel, global atomics should only be used when strictly necessary to avoid performance bottlenecks.
<b>Atomic operations in SASS/PTX</b>
In SASS code, atomic operations can be identified by either the ATOM(atomic) or RED(reduction) operation, while it corresponds to atom.global.* operations.

More information is available at <a target="_blank" href="https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#atomic-functions">https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#atomic-functions</a>`,
    shared_atomics: `Shared atomics are atomic operations that operate on data in shared memory, while ensuring that multiple threads can safely update data without introducing race conditions and thus are essential when working with shared data among parallel threads.
<b>Atomic Operations</b>
Shared atomic operations perform a read-modify-write on a 32-, 64, or 128-bit word in shared memory as a single, invdivisible operation. Common atomic operations are available for arithmetic operations (atomicAdd, atomicSub, atomicExch), bitwise operations (atomicAnd, atomicOr, atomicXor) and comparison operations (atomicMin, atomicMax, atomicCAS).
<b>Performance Considerations</b>
Due to their nature, atomics can serialize thread execution, as only a single thread can update a variable at a time. While global memory is visible to all threads in a kernel, shared memory is only visible to the threads in a block, making shared atomics a generally better choice tnah global atomics if possible.
<b>Atomic operations in SASS/PTX</b>
In SASS code, atomic operations can be identified by either the ATOM(atomic) or RED(reduction) operation, while it corresponds to atom.global.* operations.

More information is available at <a target="_blank" href="https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#atomic-functions">https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#atomic-functions</a>`,
    load_store_vec_non_vec: `Load and store operations are responsible for data transfers between registers and memory and as such commonly used in any kind of kernel. Different kinds of load and store operations are available, as efficient memory access is crucial for achieving high performance and avoid bandwidth bottlenecks.
<b>Non-Vectorized Load and Store Operations</b>
Non-Vectorized operations (ex. LD.E/ST.E) transfer individual data chunks one at a time. They are should be used in cases where only small amounts of data needs to be loaded/stored, as their overhead will lead to inefficiencies otherwise.
<b>Vectorized Load and Store Operations</b>
If multiple contiguous elements need to be loaded or stored at once (for example when working with arrays), vectorized load or store operations can be used, allowing for multiple elements to be processed by a single operation. This leads to a generally higher throughput and less used operations and should be used whenever possible. LD.E.{64,138} and ST.E.{64,128} operations allow loading and storing data in 64- or 128- bit widths instead of 32-bit non-vectorized operations.
<b>Performance Considerations</b>
Generally, vectorized load operations should always be preferred in applicable situations. As using vectorized loads increases register pressure, the amount of used registers should be kept in mind in order to avoid causing register spills.

More information is available at <a target="_blank" href="https://developer.nvidia.com/blog/cuda-pro-tip-increase-performance-with-vectorized-memory-access/">https://developer.nvidia.com/blog/cuda-pro-tip-increase-performance-with-vectorized-memory-access</a>`,
    branching: `Using branching statements like if-else or switch constructs can result in thread divergence and sequential execution of otherwise parallel threads.
To some extent, this is resolved by the compiler using predicate instructions, but in more complex kernels, this will result in conditional branches.
<b>Recommendations</b>
Deeply nested conditionals should be avoided wherever possible, with any conditional being recoverged as soon as possible.
`,
    deadlock: `Deadlocks occur when threads or warps in a program are unable to proceed because they are waiting on resources or conditions that cannot be resolved.
Even though atomic operations themselves do not inherently cause deadlocks in CUDA kernels since they are guaranteed to complete, improper use of atomic operations in combination with other synchronization mechanisms can lead to deadlocks.`,
    shared_memory: `Shared memory is a faster than global memory and shared among all threads in the same block. It should however only be used for heavily used data, as a shared memory access required both a shared and global memory read, compared to global memory only requiring a global memory read.
<b>Bank conflicts</b>
Shared memory is divided into banks, which can be accesses independently allowing for better parallelization of accesses to different banks. If multiple threads in a warp access memory locations in the same bank, a bank conflict occurrs, leading to serialization of those accesses, degrading performance.

More information is available at <a target="_blank" href="https://docs.nvidia.com/cuda/cuda-c-best-practices-guide/#shared-memory">https://docs.nvidia.com/cuda/cuda-c-best-practices-guide/#shared-memory</a>`,
    registers: `Registers are local to each CUDA thread and can be used with the lowest amount of latency. There exist two different types of registers, namely normal and predicate registers.
<b>Register Types</b>
Normal (general-purpose) registers are used to store integers, floating-point or other types of data during execution, while predicate registers are special single-bit registers used in conditionals and for example store the result of branching decisions.
<b>Performance Considerations</b>
As registers cannot be explicitly managed programmatically and are limited in number, the amount of currently used registers is an important metric when optimizing kernels. In cases where more registers are needed than available, data is spilled to slower local memory, resulting in so-called register pressure and degrading performance.

In GPUscout-GUI, the amount of currently used registers is displayed next to SASS code in relevant analyses in the format [used general purpose registers]|[used predicate registers].

More information is available at <a target="_blank" href="https://docs.nvidia.com/cuda/cuda-c-best-practices-guide/#registers">https://docs.nvidia.com/cuda/cuda-c-best-practices-guide/#registers</a>`,
    memory_graph: `The above graph gives an overview of the memory system of a GPU, as well as relevant data transfers between them. A node in the graph represents a single memory unit, with arrows between them representing the direction and amount of data transferred during kernel execution. Arrows pointing from left to right represent store operations, while arrows from right to left represent load operations, respectively.

<b>Shared Memory</b>
Shared memory is a faster than global memory and shared among all threads in the same block. It should however only be used for heavily used data, as a shared memory access required both a shared and global memory read, compared to global memory only requiring a global memory read.
Shared memory is divided into banks, which can be accesses independently allowing for better parallelization of accesses to different banks. If multiple threads in a warp access memory locations in the same bank, a bank conflict occurrs, leading to serialization of those accesses, degrading performance.
<b>Global Memory</b>
Global memory is the largest type of memory, but also introduces the most amount of latency when accessed. It can be explicitly managed by the programmer with the __global__ keyword and is accessible by all threads. A separate read-only data path can be used when data is not modified after writing, and can be used by marking pointers with the __restrict__ keyword.
<b>Local Memory</b>
Even though local memory is thread-local, accessing it is as expensive as global memory. It is also solely used to b< the compiler to store variables in case of register spilling, when there are not enough registers available to hold all data.
<b>Texture Memory</b>
Texture memory is read-only and specifically optimized to accessing data in spatially local patterns. This means, optimal performance is achieved if read addresses are near each other in a 2D or 3D locality. Texture memory is also cached, resulting in cheap reads if the access was cached.
<b>L1 and L2 Cache</b>
When handling data in global, local, shared or texture memory, requests first pass through the L1 cache providing faster access to frequently used data. Requests to main memory are also passed to a second layer L2 cache.
The hit rates of L1 and L1 caches should always be kept in mind, as low cache hit rates can be an indicator of performance bottlenecks.

More information is available at <a target="_blank" href="https://docs.nvidia.com/nsight-compute/ProfilingGuide/index.html#hardware-model">https://docs.nvidia.com/nsight-compute/ProfilingGuide/index.html#hardware-model</a> and <a target="_blank" href="https://docs.nvidia.com/cuda/cuda-c-best-practices-guide/#device-memory-spaces">https://docs.nvidia.com/cuda/cuda-c-best-practices-guide/#device-memory-spaces</a>`
};
