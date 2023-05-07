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
let gamesStarted = ref(0);
let outcomes = ref([0, 0, 0]);

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
stockfish.addEventListener('message', updateEval);
stockfish.addEventListener('message', updateBestMove);

let evaluation = ref('0');
let bestMove = ref('');

function updateEval(event: MessageEvent) {
    if (event.data.includes(`depth ${stockfishDepth}`)) {
        const ev = Number(event.data.split(' ')[9]);

        if (event.data.includes('score cp')) {
            if (chess.value.turn() === 'w') {
                if (ev > 0) {
                    evaluation.value = '+' + (ev / 100).toString();
                } else if (ev < 0) {
                    evaluation.value = (ev / 100).toString();
                }
            }

            if (chess.value.turn() === 'b') {
                if (ev > 0) {
                    evaluation.value = '-' + (ev / 100).toString();
                } else if (ev < 0) {
                    evaluation.value = '+' + Math.abs(ev / 100).toString();
                }
            }
        } else if (event.data.includes('score mate')) {
            evaluation.value = ev === undefined ? 'Checkmate' : `M${Math.abs(ev)}`;
        }
    }
}

function updateBestMove(event: MessageEvent) {
    if (event.data.includes('bestmove')) {
        bestMove.value = event.data.split(' ')[1];
    }
}

function simulate() {
    function turn() {
        if (!stopForeground.value) {
            stockfish.postMessage(`position fen ${chess.value.fen()}`);
            stockfish.postMessage(`go depth ${stockfishDepth}`);

            if (chess.value.turn() === 'w') {
                whiteAlgorithm.value.algorithm({
                    chess: chess.value as Chess,
                    boardAPI: boardAPI.value,
                    bestMove: bestMove.value,
                    eval: evaluation.value
                });
            } else if (chess.value.turn() === 'b') {
                blackAlgorithm.value.algorithm({
                    chess: chess.value as Chess,
                    boardAPI: boardAPI.value,
                    bestMove: bestMove.value,
                    eval: evaluation.value
                });
            }

            updateHistory();
        }

        if (chess.value.isGameOver()) {
            setTimeout(() => {
                handleGameOver(chess.value as Chess);

                boardAPI!.value?.resetBoard();
                chess.value.reset();
                stockfish.postMessage('ucinewgame');

                turn();
            }, 5000);
        } else {
            setTimeout(turn, 800);
        }
    }

    turn();
}

function updateHistory() {
    history.value = chess.value.pgn({
        maxWidth: 1,
        newline: '\n'
    });
}

function parseMove(move: Move) {
    if (move.color === 'w' && whiteAlgorithm.value.name === allAlgorithms.none.name) {
        chess.value.move(move.san);

        stockfish.postMessage(`position fen ${chess.value.fen()}`);
        stockfish.postMessage(`go depth ${stockfishDepth}`);

        updateHistory();
    } else if (move.color === 'b' && blackAlgorithm.value.name === allAlgorithms.none.name) {
        chess.value.move(move.san);

        stockfish.postMessage(`position fen ${chess.value.fen()}`);
        stockfish.postMessage(`go depth ${stockfishDepth}`);

        updateHistory();
    }
}

function handleGameOver(chess: Chess) {
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

function simulateMore() {
    if (
        gamesStarted.value <= 0 ||
        whiteAlgorithm.value.name === allAlgorithms.none.name ||
        blackAlgorithm.value.name === allAlgorithms.none.name
    ) {
        return;
    }

    gamesStarted.value--;

    const chess = new Chess();

    const stockfishThread = new Worker('./src/stockfish/src/stockfish.js');
    stockfishThread.postMessage('ucinewgame');

    const interval = setInterval(advanceTurn, 100);

    let bestMove = '';

    function updateBestMove(event: MessageEvent) {
        if (event.data.includes('bestmove')) {
            bestMove = event.data.split(' ')[1];
        }
    }

    stockfishThread.addEventListener('message', updateBestMove);

    function advanceTurn() {
        stockfishThread.postMessage(`position fen ${chess.fen()}`);
        stockfishThread.postMessage(`go depth ${stockfishDepth}`);

        if (chess.isGameOver()) {
            handleGameOver(chess);
            clearInterval(interval);
        } else {
            if (chess.turn() === 'w') {
                whiteAlgorithm.value.algorithm({
                    chess: chess,
                    boardAPI: undefined,
                    bestMove: bestMove
                });
            } else {
                blackAlgorithm.value.algorithm({
                    chess: chess,
                    boardAPI: undefined,
                    bestMove: bestMove
                });
            }
        }
    }
}

onBeforeMount(() => {
    setInterval(simulateMore, 100);
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

        <button @click="gamesStarted = 10">SIMULATE 10 GAMES</button>
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
        <div>BEST MOVE: {{ bestMove }}</div>

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
