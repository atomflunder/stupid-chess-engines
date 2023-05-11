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
let ponderMove = ref('');
let stockfishSkillLevel = ref(20);
let stockfishDepth = ref(10);
let stockfishMaxError = ref(200);
let stockfishProbability = ref(128);

function updateEval(event: MessageEvent) {
    if (event.data.includes(`depth ${stockfishDepth.value}`)) {
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

function setStockfishOptions(stockfish: Worker) {
    stockfish.postMessage(`setoption name Skill Level value ${stockfishSkillLevel.value}`);
    stockfish.postMessage(
        `setoption name Skill Level Maximum Error value ${stockfishMaxError.value}`
    );
    stockfish.postMessage(
        `setoption name Skill Level Probability value ${stockfishProbability.value}`
    );
}

function updateBestMove(event: MessageEvent) {
    if (event.data.includes('bestmove')) {
        bestMove.value = event.data.split(' ')[1];
        ponderMove.value = event.data.split(' ')[3];
    }
}

function simulate() {
    function turn() {
        if (!stopForeground.value) {
            stockfish.postMessage(`position fen ${chess.value.fen()}`);
            setStockfishOptions(stockfish);
            stockfish.postMessage(`go depth ${stockfishDepth.value}`);

            if (chess.value.turn() === 'w') {
                whiteAlgorithm.value.algorithm({
                    chess: chess.value as Chess,
                    boardAPI: boardAPI.value,
                    bestMove: bestMove.value,
                    ponderMove: ponderMove.value,

                    eval: evaluation.value,
                    stockfishWorker: stockfish,
                    depth: stockfishDepth.value
                });
            } else if (chess.value.turn() === 'b') {
                blackAlgorithm.value.algorithm({
                    chess: chess.value as Chess,
                    boardAPI: boardAPI.value,
                    bestMove: bestMove.value,
                    ponderMove: ponderMove.value,
                    eval: evaluation.value,
                    stockfishWorker: stockfish,
                    depth: stockfishDepth.value
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
        setStockfishOptions(stockfish);
        stockfish.postMessage(`go depth ${stockfishDepth.value}`);

        updateHistory();
    } else if (move.color === 'b' && blackAlgorithm.value.name === allAlgorithms.none.name) {
        chess.value.move(move.san);

        stockfish.postMessage(`position fen ${chess.value.fen()}`);
        setStockfishOptions(stockfish);
        stockfish.postMessage(`go depth ${stockfishDepth.value}`);

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
    setStockfishOptions(stockfish);

    const interval = setInterval(advanceTurn, 100);

    let bestMove = '';
    let ponderMove = '';

    function updateBestMove(event: MessageEvent) {
        if (event.data.includes('bestmove')) {
            bestMove = event.data.split(' ')[1];
            ponderMove = event.data.split(' ')[3];
        }
    }

    stockfishThread.addEventListener('message', updateBestMove);

    function advanceTurn() {
        stockfishThread.postMessage(`position fen ${chess.fen()}`);
        stockfishThread.postMessage(`go depth ${stockfishDepth.value}`);

        if (chess.isGameOver()) {
            handleGameOver(chess);
            clearInterval(interval);
        } else {
            if (chess.turn() === 'w') {
                whiteAlgorithm.value.algorithm({
                    chess: chess,
                    boardAPI: undefined,
                    bestMove: bestMove,
                    ponderMove: ponderMove,
                    stockfishWorker: stockfishThread,
                    depth: stockfishDepth.value
                });
            } else {
                blackAlgorithm.value.algorithm({
                    chess: chess,
                    boardAPI: undefined,
                    bestMove: bestMove,
                    ponderMove: ponderMove,
                    stockfishWorker: stockfishThread,
                    depth: stockfishDepth.value
                });
            }
        }
    }
}

onBeforeMount(() => {
    stockfish.postMessage(`position fen ${chess.value.fen()}`);
    setStockfishOptions(stockfish);
    stockfish.postMessage(`go depth ${stockfishDepth.value}`);

    setInterval(simulateMore, 100);
    simulate();
});
</script>

<template>
    <div class="sidebar-left">
        <div class="boxes">
            <div class="white-box">
                <button class="button" @click="gamesStarted = 10">SIMULATE 10 GAMES</button>

                <img
                    src="@/assets/knight-white.svg"
                    title="White"
                    alt="pawn-icon"
                    width="32"
                    height="32"
                    class="black-outline"
                />
                ELO: {{ Math.floor(whiteElo) }} (W{{ outcomes[0] }} - D{{ outcomes[2] }} - L{{
                    outcomes[1]
                }})
                <select class="select" name="White Algorithm" id="white" v-model="whiteAlgorithm">
                    <option v-for="(algo, i) in allAlgorithms" :key="i" :value="algo">
                        {{ algo.name }}
                    </option>
                </select>
            </div>

            <div class="black-box">
                <button class="button" @click="stopForeground = !stopForeground">
                    TOGGLE SHOWN GAME
                </button>

                <img
                    src="@/assets/knight-black.svg"
                    title="Black"
                    alt="pawn-icon"
                    width="32"
                    height="32"
                    class="white-outline"
                />
                ELO: {{ Math.floor(blackElo) }} (W{{ outcomes[1] }} - D{{ outcomes[2] }} - L{{
                    outcomes[0]
                }})
                <select class="select" name="Black Algorithm" id="black" v-model="blackAlgorithm">
                    <option v-for="(algo, i) in allAlgorithms" :key="i" :value="algo">
                        {{ algo.name }}
                    </option>
                </select>
            </div>
        </div>

        <div class="stockfish">
            <img
                src="@/assets/settings.svg"
                title="Stockfish Settings"
                alt="pawn-icon"
                width="32"
                height="32"
                class="black-outline"
                style="grid-row: 1"
            />
            <div style="grid-row: 1">STOCKFISH SETTINGS</div>

            <input
                class="slider"
                style="grid-row: 2"
                type="range"
                min="0"
                max="20"
                v-model="stockfishSkillLevel"
            />
            <div style="grid-row: 2">LEVEL: {{ stockfishSkillLevel }}</div>

            <input
                class="slider"
                style="grid-row: 3"
                type="range"
                min="1"
                max="20"
                v-model="stockfishDepth"
            />
            <div style="grid-row: 3">DEPTH: {{ stockfishDepth }}</div>

            <input
                class="slider"
                style="grid-row: 4"
                type="range"
                min="0"
                max="5000"
                v-model="stockfishMaxError"
            />
            <div style="grid-row: 4">MAX ERROR: {{ stockfishMaxError }}</div>

            <input
                class="slider"
                style="grid-row: 5"
                type="range"
                min="1"
                max="1000"
                v-model="stockfishProbability"
            />
            <div style="grid-row: 5">PROBABILITY: {{ stockfishProbability }}</div>
        </div>
    </div>

    <div class="center">
        <div>
            <img
                src="@/assets/pawn.svg"
                alt="pawn-icon"
                width="16"
                height="16"
                title="Material Difference"
            />
            {{ boardAPI?.getMaterialCount().materialDiff }}
            <img
                src="@/assets/eval.svg"
                alt="eval-icon"
                width="16"
                height="16"
                title="Stockfish Evaluation"
            />
            {{ evaluation }}
            <img
                src="@/assets/move.svg"
                alt="move-icon"
                width="16"
                height="16"
                title="Stockfish Best Move"
            />
            {{ bestMove }}
        </div>

        <TheChessboard
            :board-config="boardConfig"
            @board-created="createBoard"
            @move="(move) => parseMove(move)"
        ></TheChessboard>
        <button class="button" style="margin-right: 2px" @click="boardAPI?.toggleOrientation()">
            TOGGLE ORIENTATION
        </button>
        <button class="button" style="margin-left: 2px" @click="boardAPI?.toggleMoves()">
            TOGGLE MOVES
        </button>
    </div>

    <div class="sidebar-right">
        <p style="white-space: pre-line">{{ history }}</p>
    </div>
</template>

<style scoped>
.sidebar-left {
    height: 100%;
    width: 400px;
    position: fixed;
    z-index: 1;
    top: 0;
    left: 0;
    overflow-x: hidden;
    padding-top: 20px;
}

.sidebar-right {
    height: 100%;
    width: 400px;
    position: fixed;
    z-index: 1;
    top: 0;
    right: 0;
    overflow-x: hidden;
    padding-top: 20px;
}

@media (max-width: 1700px) {
    .sidebar-right {
        display: none;
    }
}

.center {
    justify-content: center;
    text-align: center;
    padding: 16px;
}

.boxes {
    display: grid;
    grid-template-columns: 190px 190px;
    gap: 20px;
}

.white-box {
    display: grid;
}

.black-box {
    display: grid;
}

.stockfish {
    display: grid;
    margin-top: 100px;
    grid-template-columns: 245px 150px;
    gap: 5px;
}

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

.slider {
    accent-color: #444;
}

.white-outline {
    filter: drop-shadow(-1px -1px 0px #fff) drop-shadow(1px -1px 0px #fff)
        drop-shadow(1px 1px 0px #fff) drop-shadow(-1px 1px 0px #fff);
}

.black-outline {
    filter: drop-shadow(-1px -1px 0px #000) drop-shadow(1px -1px 0px #000)
        drop-shadow(1px 1px 0px #000) drop-shadow(-1px 1px 0px #000);
}
</style>
