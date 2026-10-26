<script setup lang="ts">
const props = withDefaults(defineProps<{ size?: number }>(), { size: 40 })
</script>

<template>
  <img
    src="/logo.svg"
    :width="props.size"
    :height="props.size"
    class="block shrink-0"
    alt="KoolControl"
  />
</template>
