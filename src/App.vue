<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';

import { TheChessboard, BoardApi } from 'vue3-chessboard';
import type { BoardConfig } from 'vue3-chessboard';

import 'vue3-chessboard/style.css';

import { Chess, type Move } from 'chess.js';
import { calculateElo } from './helpers/elo';
import { allAlgorithms } from './helpers/algorithms';
import { Outcome } from './helpers/outcomes';

const boardAPI = ref<BoardApi>();

const boardConfig: BoardConfig = {
    coordinates: true
};

const stockfishDepth = '10';

let whiteElo = ref(1000);
let blackElo = ref(1000);
let outcomes = ref([0, 0, 0]);

let stopBackground = ref(true);
let stopForeground = ref(true);

let whiteAlgorithm = ref(allAlgorithms.none);
let blackAlgorithm = ref(allAlgorithms.none);

function createBoard(api: BoardApi) {
    boardAPI.value = api;
}

const chess = ref(new Chess());
let history = ref('');

const stockfish = new Worker('./src/stockfish/src/stockfish.js');
stockfish.postMessage('uci');
stockfish.postMessage('ucinewgame');

const evaluation = ref('0');

function simulate() {
    function turn() {
        if (!stopForeground.value) {
            stockfish.postMessage(`position fen ${chess.value.fen()}`);
            stockfish.postMessage(`go depth ${stockfishDepth}`);

            if (chess.value.turn() === 'w') {
                whiteAlgorithm.value.algorithm({
                    chess: chess.value as Chess,
                    boardAPI: boardAPI.value,
                    stockfishWorker: stockfish,
                    stockfishDepth: stockfishDepth
                });
            } else {
                blackAlgorithm.value.algorithm({
                    chess: chess.value as Chess,
                    boardAPI: boardAPI.value,
                    stockfishWorker: stockfish,
                    stockfishDepth: stockfishDepth
                });
            }

            updateEvalHistory();
        }

        if (chess.value.isGameOver()) {
            return;
        } else {
            setTimeout(turn, 800);
        }
    }

    turn();
}

function updateEvalHistory() {
    history.value = chess.value.pgn({
        maxWidth: 1,
        newline: '\n'
    });

    stockfish.addEventListener('message', (event) => {
        if (event.data.includes(`depth ${stockfishDepth}`)) {
            if (event.data.includes('score cp')) {
                evaluation.value = (event.data.split(' ')[9] / 100).toString();
            } else if (event.data.includes('score mate')) {
                const mateIn = event.data.split(' ')[9];

                evaluation.value = mateIn === undefined ? '#' : `M${mateIn}`;
            }
        }
    });
}

function parseMove(move: Move) {
    if (move.color === 'w' && whiteAlgorithm.value.name === allAlgorithms.none.name) {
        chess.value.move(move.san);

        stockfish.postMessage(`position fen ${chess.value.fen()}`);
        stockfish.postMessage(`go depth ${stockfishDepth}`);

        updateEvalHistory();
    } else if (move.color === 'b' && blackAlgorithm.value.name === allAlgorithms.none.name) {
        chess.value.move(move.san);

        stockfish.postMessage(`position fen ${chess.value.fen()}`);
        stockfish.postMessage(`go depth ${stockfishDepth}`);

        updateEvalHistory();
    }
}

function simulateMore() {
    if (
        stopBackground.value ||
        outcomes.value[0] + outcomes.value[1] + outcomes.value[2] >= 100 ||
        whiteAlgorithm.value.name === allAlgorithms.none.name ||
        blackAlgorithm.value.name === allAlgorithms.none.name
    ) {
        return;
    }

    const chess = new Chess();

    while (!chess.isGameOver()) {
        if (chess.turn() === 'w') {
            whiteAlgorithm.value.algorithm({
                chess: chess,
                boardAPI: undefined,
                stockfishWorker: stockfish
            });
        } else {
            blackAlgorithm.value.algorithm({
                chess: chess,
                boardAPI: undefined,
                stockfishWorker: stockfish
            });
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

        <div>EVAL: {{ evaluation }}</div>

        <div>MOVES:</div>
        <p style="white-space: pre-line">{{ history }}</p>
    </div>

    <TheChessboard
        :board-config="boardConfig"
        @board-created="createBoard"
        @move="(move) => parseMove(move)"
    ></TheChessboard>
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
