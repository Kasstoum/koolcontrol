<script setup lang="ts">
const props = withDefaults(defineProps<{ size?: number }>(), { size: 40 })
</script>

<template>
  <svg :width="props.size" :height="props.size" viewBox="0 0 512 512" role="img" aria-label="KoolControl">
    <defs>
      <clipPath id="thermo-clip">
        <rect x="232" y="150" width="48" height="190" rx="24" />
      </clipPath>
    </defs>
    <circle cx="256" cy="256" r="150" fill="none" stroke="#FFFFFF" stroke-width="30" stroke-linecap="round" />
    <rect x="232" y="150" width="48" height="190" rx="24" fill="#FFFFFF" />
    <circle cx="256" cy="340" r="34" fill="#FFFFFF" />
    <g clip-path="url(#thermo-clip)" opacity="0.95">
      <path d="M220 258 C248 250 272 266 300 258 L300 380 L220 380 Z" fill="#F97316" />
    </g>
  </svg>
</template>
