<template>
    <button class="button" @click="$emit('simulate-games')">SIMULATE 10 GAMES</button>
    <button class="button" @click="$emit('toggle-game')">
        TOGGLE GAME
        <span v-if="stopForeground" class="material-symbols-outlined">play_arrow</span>
        <span v-else class="material-symbols-outlined">pause</span>
    </button>
</template>

<script setup lang="ts">
defineProps<{
    stopForeground: boolean;
}>();

defineEmits(['simulate-games', 'toggle-game']);
</script>

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
}

.button:hover {
    background-color: #444;
}

.material-symbols-outlined {
    font-size: 18px;
}
</style>
