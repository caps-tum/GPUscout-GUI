<template>
  <div
    class="grid h-full max-h-72 w-full grid-cols-[50%_50%] grid-rows-1 space-x-1 overflow-y-auto"
  >
    <CodeView :code="source_code" :mode="CODE_VIEW.SOURCE_CODE" />
    <CodeView :code="binary_code" :mode="CODE_VIEW.BINARY_CODE" />
  </div>
</template>
<script setup>
import CodeView from './CodeView.vue';
import { CODE_VIEW } from '../../stores/CodeViewerStore';

let source_code =
  '__global__ void kernel(int M, int N, int K, float alpha, const float *A,\n' +
  '    const float *B, float beta, float *C) {\n' +
  '    const uint x = blockIdx.x * blockDim.x + threadIdx.x;\n' +
  '    const uint y = blockIdx.y * blockDim.y + threadIdx.y;\n' +
  '\n' +
  '    // if statement is necessary to make ,make make maek things work under tile quantization\n' +
  '    if (x < M && y < N) {\n' +
  '        float tmp = 0.0;\n' +
  '        for (int i = 0; i < K; ++i) {\n' +
  '            tmp += A[x * K + i] * B[i * N + y];\n' +
  '        }\n' +
  '        // C = α*(A@B)+β*C\n' +
  '        C[x * N + y] = alpha * tmp + beta * C[x * N + y];\n' +
  '    }\n' +
  '}';

let binary_code =
  '        /*00a8*/                   MOV R20, c[0x0][0x148] ;c[0x0][0x148]c[0x0][0x148]c[0x0][0x148]\n' +
  '        /*00b0*/                   MOV R0, RZ ;\n' +
  '        /*00b8*/                   ISETP.GE.AND P0, PT, R20, 0x1, PT ;\n' +
  '        /*00c8*/              @!P0 BRA `(.L_x_0) ;\n' +
  '        /*00d0*/                   IADD32I R0, R20.reuse, -0x1 ;\n' +
  '        /*00d8*/                   LOP32I.AND R20, R20, 0x3 ;\n' +
  '        /*00e8*/                   MOV R24, RZ ;\n' +
  '        /*00f0*/                   ISETP.GE.U32.AND P1, PT, R0, 0x3, PT ;\n' +
  '        /*00f8*/                   MOV R0, RZ ;\n' +
  '        /*0108*/         {         ISETP.NE.AND P0, PT, R20, RZ, PT ;\n' +
  '        /*0110*/              @!P1 BRA `(.L_x_1)         }\n' +
  '        /*0118*/                   IADD R0, R3, c[0x0][0x144] ;\n' +
  '        /*0128*/                   MOV32I R4, 0x3 ;\n' +
  '        /*0130*/                   MOV R23, c[0x0][0x144] ;\n' +
  '        /*0138*/                   XMAD.MRG R5, R19, c[0x0] [0x148].H1, RZ ;\n' +
  '        /*0148*/                   IADD R26, R20, -c[0x0][0x148] ;\n' +
  '        /*0150*/                   MOV R24, RZ ;\n' +
  '        /*0158*/                   XMAD R28, R2.reuse, c[0x0] [0xc], R0 ;\n' +
  '        /*0168*/                   XMAD R0, R19, c[0x0] [0x148], R4 ;\n' +
  '        /*0170*/                   XMAD R21, R23.reuse, 0x3, R18 ;\n' +
  '        /*0178*/                   MOV R25, R18.reuse ;\n' +
  '        /*0188*/                   ISCADD R22, R23, R18, 0x1 ;\n' +
  '        /*0190*/                   XMAD.PSL.CBCC R28, R2.H1, R7.H1, R28 ;\n' +
  '        /*0198*/                   XMAD.PSL.CBCC R27, R19.H1, R5.H1, R0 ;\n' +
  '        /*01a8*/                   MOV R0, RZ ;\n' +
  '        /*01b0*/                   XMAD.PSL R21, R23.H1, 0x3, R21 ;';
</script>
