<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';

import { TheChessboard, BoardApi } from 'vue3-chessboard';
import type { BoardConfig } from 'vue3-chessboard';

import 'vue3-chessboard/style.css';

import { Chess } from 'chess.js';
import { calculateElo } from './helpers/elo';
import { allAlgorithms } from './helpers/algorithms';
import { Outcome } from './helpers/outcomes';

const boardAPI = ref<BoardApi>();

const boardConfig: BoardConfig = {
    coordinates: true
};

let whiteElo = ref(1000);
let blackElo = ref(1000);
let outcomes = ref([0, 0, 0]);

let stopBackground = ref(true);
let stopForeground = ref(true);

let whiteAlgorithm = ref(allAlgorithms.random);
let blackAlgorithm = ref(allAlgorithms.random);

function createBoard(api: BoardApi) {
    boardAPI.value = api;
}

const chess = ref(new Chess());
let history = ref('');

function simulate() {
    function turn() {
        if (!stopForeground.value) {
            if (chess.value.turn() === 'w') {
                whiteAlgorithm.value.algorithm(chess.value as Chess, boardAPI.value!);
            } else {
                blackAlgorithm.value.algorithm(chess.value as Chess, boardAPI.value!);
            }

            history.value = chess.value.pgn({
                maxWidth: 1,
                newline: '\n'
            });
        }

        if (chess.value.isGameOver()) {
            return;
        } else {
            setTimeout(turn, 800);
        }
    }

    turn();
}

function simulateMore() {
    if (stopBackground.value || outcomes.value[0] + outcomes.value[1] + outcomes.value[2] >= 100) {
        return;
    }

    const chess = new Chess();

    while (!chess.isGameOver()) {
        if (chess.turn() === 'w') {
            whiteAlgorithm.value.algorithm(chess);
        } else {
            blackAlgorithm.value.algorithm(chess);
        }
    }

    if (chess.isCheckmate()) {
        if (chess.turn() === 'w') {
            [whiteElo.value, blackElo.value] = calculateElo(
                whiteElo.value,
                blackElo.value,
                Outcome.Loss
            );
            outcomes.value[1]++;
        } else {
            [whiteElo.value, blackElo.value] = calculateElo(
                whiteElo.value,
                blackElo.value,
                Outcome.Win
            );
            outcomes.value[0]++;
        }
    } else {
        [whiteElo.value, blackElo.value] = calculateElo(
            whiteElo.value,
            blackElo.value,
            Outcome.Draw
        );
        outcomes.value[2]++;
    }
}

onBeforeMount(() => {
    setInterval(simulateMore, 10);
    simulate();
});
</script>

<template>
    <div class="sidebar">
        <div>
            White: {{ Math.floor(whiteElo) }}
            <br />
            Black: {{ Math.floor(blackElo) }}
            <br />
            Outcomes: W{{ outcomes[0] }} - B{{ outcomes[1] }} - D{{ outcomes[2] }}
        </div>

        <button @click="stopBackground = !stopBackground">TOGGLE BACKGROUND GAMES</button>
        <button @click="stopForeground = !stopForeground">TOGGLE VISUALISED GAME</button>

        <br />

        WHITE
        <select name="White Algorithm" id="white" v-model="whiteAlgorithm">
            <option v-for="(algo, i) in allAlgorithms" :key="i" :value="algo">
                {{ algo.name }}
            </option>
        </select>

        <br />
        BLACK
        <select name="Black Algorithm" id="black" v-model="blackAlgorithm">
            <option v-for="(algo, i) in allAlgorithms" :key="i" :value="algo">
                {{ algo.name }}
            </option>
        </select>

        <div>MOVES:</div>
        <p style="white-space: pre-line">{{ history }}</p>
    </div>

    <TheChessboard :board-config="boardConfig" @board-created="createBoard"></TheChessboard>
</template>

<style scoped>
.sidebar {
    height: 100%;
    width: 400px;
    position: fixed;
    z-index: 1;
    top: 0;
    left: 0;
    overflow-x: hidden;
    padding-top: 20px;
}
</style>
