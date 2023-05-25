<template>
    <button
        class="button"
        @click="$emit('simulate-games')"
        :disabled="isDisabled(whiteAlgorithmName, blackAlgorithmName)"
        :title="
            isDisabled(whiteAlgorithmName, blackAlgorithmName)
                ? 'Please select an algorithm for both players.'
                : 'Simulate 10 matches in the background.'
        "
    >
        SIMULATE 10 GAMES
    </button>
    <button
        class="button"
        @click="$emit('toggle-game')"
        :disabled="isDisabled(whiteAlgorithmName, blackAlgorithmName)"
        :title="
            isDisabled(whiteAlgorithmName, blackAlgorithmName)
                ? 'Please select an algorithm for both players.'
                : 'Simulate the shown game.'
        "
    >
        TOGGLE GAME
        <span v-if="stopForeground" class="material-symbols-outlined">play_arrow</span>
        <span v-else class="material-symbols-outlined">pause</span>
    </button>
</template>

<script setup lang="ts">
function isDisabled(white: string, black: string) {
    return !(white !== 'None (Player Controlled)' && black !== 'None (Player Controlled)');
}

defineProps<{
    stopForeground: boolean;
    whiteAlgorithmName: string;
    blackAlgorithmName: string;
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

.button:disabled {
    cursor: not-allowed;
    background-color: #222;
}

.material-symbols-outlined {
    font-size: 18px;
}
</style>
