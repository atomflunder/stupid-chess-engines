<script setup lang="ts">
defineEmits(['toggle-orientation', 'toggle-moves', 'undo-move']);
</script>

<template>
    <button class="button" @click="$emit('toggle-orientation')">TOGGLE ORIENTATION</button>
    <button class="button" @click="$emit('toggle-moves')">TOGGLE MOVES</button>
    <button class="button" @click="$emit('undo-move')">UNDO LAST MOVE</button>
</template>

<style scoped>
.button {
    background-color: #333;
    border: 2px;
    color: #fff;
    padding: 10px;
    font-size: 16px;
    cursor: pointer;
    margin-top: 20px;
    margin-bottom: 20px;
    margin-left: 1px;
    margin-right: 1px;
    justify-content: center;
    text-align: center;
}

.button:hover {
    background-color: #444;
}
</style>
