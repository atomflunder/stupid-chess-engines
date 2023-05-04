<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';

import { TheChessboard, BoardApi } from 'vue3-chessboard';
import type { BoardConfig } from 'vue3-chessboard';

import 'vue3-chessboard/style.css';

import { Chess } from 'chess.js';
import { pacifistMove, pacifistMoveHeadless } from './helpers/algorithms/pacifist';
import { warMove, warMoveHeadless } from './helpers/algorithms/war';
import { randomMove, randomMoveHeadless } from './helpers/algorithms/random';
import { firstMove, firstMoveHeadless } from './helpers/algorithms/first';
import { pawnMove, pawnMoveHeadless } from './helpers/algorithms/pawn';
import { calculateElo } from './helpers/elo';
import { Algorithms, allAlgorithms } from './helpers/algorithms';
import { Side } from './helpers/side';
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

let whiteAlgorithm = ref(randomMove);
let whiteAlgorithmHeadless = ref(randomMoveHeadless);
let whiteAlgorithmSelected = ref(Algorithms.Random);
let blackAlgorithm = ref(randomMove);
let blackAlgorithmHeadless = ref(randomMoveHeadless);
let blackAlgorithmSelected = ref(Algorithms.Random);

function changeAlgorithm(side: Side) {
    if (side === Side.White) {
        switch (whiteAlgorithmSelected.value) {
            case Algorithms.Random:
                whiteAlgorithm.value = randomMove;
                whiteAlgorithmHeadless.value = randomMoveHeadless;
                break;
            case Algorithms.First:
                whiteAlgorithm.value = firstMove;
                whiteAlgorithmHeadless.value = firstMoveHeadless;
                break;
            case Algorithms.Pawn:
                whiteAlgorithm.value = pawnMove;
                whiteAlgorithmHeadless.value = pawnMoveHeadless;
                break;
            case Algorithms.War:
                whiteAlgorithm.value = warMove;
                whiteAlgorithmHeadless.value = warMoveHeadless;
                break;
            case Algorithms.Pacifist:
                whiteAlgorithm.value = pacifistMove;
                whiteAlgorithmHeadless.value = pacifistMoveHeadless;
                break;
        }
    } else {
        switch (blackAlgorithmSelected.value) {
            case Algorithms.Random:
                blackAlgorithm.value = randomMove;
                blackAlgorithmHeadless.value = randomMoveHeadless;
                break;
            case Algorithms.First:
                blackAlgorithm.value = firstMove;
                blackAlgorithmHeadless.value = firstMoveHeadless;
                break;
            case Algorithms.Pawn:
                blackAlgorithm.value = pawnMove;
                blackAlgorithmHeadless.value = pawnMoveHeadless;
                break;
            case Algorithms.War:
                blackAlgorithm.value = warMove;
                blackAlgorithmHeadless.value = warMoveHeadless;
                break;
            case Algorithms.Pacifist:
                blackAlgorithm.value = pacifistMove;
                blackAlgorithmHeadless.value = pacifistMoveHeadless;
                break;
        }
    }
}

function createBoard(api: BoardApi) {
    boardAPI.value = api;
}

function simulate() {
    const chess = new Chess();

    function turn() {
        if (!stopForeground.value) {
            if (chess.turn() === 'w') {
                whiteAlgorithm.value(boardAPI.value!, chess);
            } else {
                blackAlgorithm.value(boardAPI.value!, chess);
            }
        }

        if (chess.isGameOver()) {
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
            whiteAlgorithmHeadless.value(chess);
        } else {
            blackAlgorithmHeadless.value(chess);
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
    <select
        name="White Algorithm"
        id="white"
        @change="changeAlgorithm(Side.White)"
        v-model="whiteAlgorithmSelected"
    >
        <option v-for="(algo, i) in allAlgorithms" :key="algo" :value="algo">
            {{ Algorithms[i] }}
        </option>
    </select>

    <br />
    BLACK
    <select
        name="Black Algorithm"
        id="black"
        @change="changeAlgorithm(Side.Black)"
        v-model="blackAlgorithmSelected"
    >
        <option v-for="(algo, i) in allAlgorithms" :key="algo" :value="algo">
            {{ Algorithms[i] }}
        </option>
    </select>

    <TheChessboard :board-config="boardConfig" @board-created="createBoard"></TheChessboard>
</template>

<style scoped></style>
