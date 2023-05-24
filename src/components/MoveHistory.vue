<template>
    <div class="move-history-grid" id="move-history-grid">
        <div class="white-header">
            <img
                src="src/assets/knight-white.svg"
                title="White"
                alt="knight-icon"
                width="16"
                height="16"
                class="white-outline"
            />{{ whiteAlgorithmName }}
        </div>
        <div class="black-header">
            <img
                src="src/assets/knight-black.svg"
                title="Black"
                alt="knight-icon"
                width="16"
                height="16"
                class="black-outline"
            />{{ blackAlgorithmName }}
        </div>
    </div>
    <div v-for="(line, i) in history.split('\n')" :key="i" class="move-history-grid">
        <div class="move-number">
            {{ line.split(' ')[0] }}
        </div>
        <div class="white-move">
            {{ line.split(' ')[1] }}
        </div>
        <div class="black-move">
            {{ line.split(' ')[2] }}
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    history: string;
    whiteAlgorithmName: string;
    blackAlgorithmName: string;
}>();
</script>

<style scoped>
.move-history-grid {
    display: grid;
    margin-left: 20px;
    margin-top: 4px;
    grid-template-columns: 50px 150px 150px;
}

.move-number {
    color: #aaa;
    font-style: italic;
}

.white-move {
    font-size: 16px;
}

.black-move {
    font-size: 16px;
}

.white-header {
    grid-column: 2;
    color: #aaa;
    font-size: 14px;
    font-style: italic;
}

.black-header {
    grid-column: 3;
    color: #aaa;
    font-size: 14px;
    font-style: italic;
}

.black-outline {
    filter: drop-shadow(-0.5px -0.5px 0px #fff) drop-shadow(0.5px -0.5px 0px #fff)
        drop-shadow(0.5px 0.5px 0px #fff) drop-shadow(-0.5px 0.5px 0px #fff);
}

.white-outline {
    filter: drop-shadow(-0.5px -0.5px 0px #000) drop-shadow(0.5px -0.5px 0px #000)
        drop-shadow(0.5px 0.5px 0px #000) drop-shadow(-0.5px 0.5px 0px #000);
}
</style>
