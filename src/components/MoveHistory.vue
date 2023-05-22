<template>
    <p style="white-space: pre-line">{{ history }}</p>
</template>

<script setup lang="ts">
defineProps<{
    history: string;
}>();
</script>

<style scoped></style>
