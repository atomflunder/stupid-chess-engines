<template>
    <div class="box">
        <img
            :src="`src/assets/knight-${colour}.svg`"
            :title="colour.charAt(0).toUpperCase() + colour.slice(1)"
            alt="knight-icon"
            width="32"
            height="32"
            :class="`${colour}-outline`"
        />
        <div>ELO: {{ Math.floor(elo) }}</div>
        <div>W{{ wins }} - D{{ draws }} - L{{ losses }}</div>
        <select
            class="select"
            :name="`${colour.charAt(0).toUpperCase() + colour.slice(1)} Algorithm`"
            :id="colour"
            @change="
                $emit(
                    'change-algorithm',
                    colour,
                    // @ts-ignore
                    allAlgorithms[
                        Object.keys(allAlgorithms)[
                            ($event.target as HTMLSelectElement).selectedIndex
                        ]
                    ]
                )
            "
        >
            <option v-for="(algo, i) in allAlgorithms" :key="i" :value="JSON.stringify(algo)">
                {{ algo.name }}
            </option>
        </select>
    </div>
</template>

<script setup lang="ts">
import { allAlgorithms } from '@/helpers/algorithms';

defineProps<{
    wins: number;
    losses: number;
    draws: number;
    elo: number;
    colour: string;
}>();

defineEmits([`change-algorithm`]);
</script>

<style scoped>
.box {
    display: grid;
}
.black-outline {
    filter: drop-shadow(-1px -1px 0px #fff) drop-shadow(1px -1px 0px #fff)
        drop-shadow(1px 1px 0px #fff) drop-shadow(-1px 1px 0px #fff);
}

.white-outline {
    filter: drop-shadow(-1px -1px 0px #000) drop-shadow(1px -1px 0px #000)
        drop-shadow(1px 1px 0px #000) drop-shadow(-1px 1px 0px #000);
}

.select {
    background-color: #333;
    border: 2px;
    color: #fff;
    padding: 10px;
    font-size: 14px;
    cursor: pointer;
}

.select:hover {
    background-color: #444;
}
</style>
