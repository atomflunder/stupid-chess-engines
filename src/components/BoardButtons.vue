<script setup lang="ts">
defineEmits(['toggle-orientation', 'toggle-moves']);
</script>

<template>
    <button class="button" style="margin-right: 2px" @click="$emit('toggle-orientation')">
        TOGGLE ORIENTATION
    </button>
    <button class="button" style="margin-left: 2px" @click="$emit('toggle-moves')">
        TOGGLE MOVES
    </button>
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
    justify-content: center;
    text-align: center;
}

.button:hover {
    background-color: #444;
}
</style>
