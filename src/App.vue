<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';

import type { BoardConfig } from 'vue3-chessboard';
import { BoardApi, TheChessboard } from 'vue3-chessboard';

import 'vue3-chessboard/style.css';

import { Chess, type Move } from 'chess.js';
import { allAlgorithms } from './helpers/algorithms';
import { calculateElo } from './helpers/elo';
import {
    changeStockfishDepth,
    changeStockfishLevel,
    changeStockfishMaxError,
    changeStockfishProbability,
    type StockfishOptions
} from './helpers/options';
import { Outcome } from './helpers/outcomes';

import BoardButtons from './components/BoardButtons.vue';
import BoardEval from './components/BoardEval.vue';
import GameButtons from './components/GameButtons.vue';
import MoveHistory from './components/MoveHistory.vue';
import PlayerBox from './components/PlayerBox.vue';
import StockfishSettings from './components/StockfishSettings.vue';

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
let stockfishOptions = ref({
    level: 20,
    depth: 10,
    maxError: 200,
    probability: 128,
    fen: chess.value.fen()
});

function updateEval(event: MessageEvent) {
    if (event.data.includes(`depth ${stockfishOptions.value.depth}`)) {
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
    stockfish.postMessage(`setoption name Skill Level value ${stockfishOptions.value.level}`);
    stockfish.postMessage(
        `setoption name Skill Level Maximum Error value ${stockfishOptions.value.maxError}`
    );
    stockfish.postMessage(
        `setoption name Skill Level Probability value ${stockfishOptions.value.probability}`
    );
}

function changeAlgorithm(colour: string, algorithm: any) {
    if (colour === 'white') {
        whiteAlgorithm.value = algorithm;
    } else {
        blackAlgorithm.value = algorithm;
    }
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
            stockfish.postMessage(`position fen ${stockfishOptions.value.fen}`);
            setStockfishOptions(stockfish);
            stockfish.postMessage(`go depth ${stockfishOptions.value.depth}`);

            if (chess.value.turn() === 'w') {
                whiteAlgorithm.value.algorithm({
                    chess: chess.value as Chess,
                    boardAPI: boardAPI.value,
                    bestMove: bestMove.value,
                    ponderMove: ponderMove.value,
                    eval: evaluation.value,
                    stockfishWorker: stockfish,
                    stockfishOptions: stockfishOptions.value as StockfishOptions
                });
            } else if (chess.value.turn() === 'b') {
                blackAlgorithm.value.algorithm({
                    chess: chess.value as Chess,
                    boardAPI: boardAPI.value,
                    bestMove: bestMove.value,
                    ponderMove: ponderMove.value,
                    eval: evaluation.value,
                    stockfishWorker: stockfish,
                    stockfishOptions: stockfishOptions.value as StockfishOptions
                });
            }

            updateHistory();
        }

        stockfishOptions.value.fen = chess.value.fen();

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

        stockfish.postMessage(`position fen ${stockfishOptions.value.fen}`);
        setStockfishOptions(stockfish);
        stockfish.postMessage(`go depth ${stockfishOptions.value.depth}`);

        updateHistory();
    } else if (move.color === 'b' && blackAlgorithm.value.name === allAlgorithms.none.name) {
        chess.value.move(move.san);

        stockfish.postMessage(`position fen ${stockfishOptions.value.fen}`);
        setStockfishOptions(stockfish);
        stockfish.postMessage(`go depth ${stockfishOptions.value.depth}`);

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
    let ponderMove = '';

    function updateBestMove(event: MessageEvent) {
        if (event.data.includes('bestmove')) {
            bestMove = event.data.split(' ')[1];
            ponderMove = event.data.split(' ')[3];
        }
    }

    let stockfishOptions = {
        level: 20,
        depth: 10,
        maxError: 200,
        probability: 128,
        fen: chess.fen()
    };

    stockfishThread.postMessage(`setoption name Skill Level value ${stockfishOptions.level}`);
    stockfishThread.postMessage(
        `setoption name Skill Level Maximum Error value ${stockfishOptions.maxError}`
    );
    stockfishThread.postMessage(
        `setoption name Skill Level Probability value ${stockfishOptions.probability}`
    );

    stockfishThread.addEventListener('message', updateBestMove);

    function advanceTurn() {
        stockfishThread.postMessage(`position fen ${stockfishOptions.fen}`);
        stockfishThread.postMessage(`go depth ${stockfishOptions.depth}`);

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
                    stockfishOptions: stockfishOptions as StockfishOptions
                });
            } else {
                blackAlgorithm.value.algorithm({
                    chess: chess,
                    boardAPI: undefined,
                    bestMove: bestMove,
                    ponderMove: ponderMove,
                    stockfishWorker: stockfishThread,
                    stockfishOptions: stockfishOptions as StockfishOptions
                });
            }
        }

        stockfishOptions.fen = chess.fen();
    }
}

onBeforeMount(() => {
    stockfish.postMessage(`position fen ${stockfishOptions.value.fen}`);
    setStockfishOptions(stockfish);
    stockfish.postMessage(`go depth ${stockfishOptions.value.depth}`);

    setInterval(simulateMore, 100);
    simulate();
});
</script>

<template>
    <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
        rel="stylesheet"
    />

    <div class="sidebar-left">
        <div class="boxes">
            <GameButtons
                @simulate-games="gamesStarted = 10"
                @toggle-game="stopForeground = !stopForeground"
                :stop-foreground="stopForeground"
            />

            <PlayerBox
                colour="white"
                :elo="whiteElo"
                :wins="outcomes[0]"
                :draws="outcomes[1]"
                :losses="outcomes[2]"
                @change-algorithm="changeAlgorithm"
            />

            <PlayerBox
                colour="black"
                :elo="blackElo"
                :wins="outcomes[2]"
                :draws="outcomes[1]"
                :losses="outcomes[0]"
                @change-algorithm="changeAlgorithm"
            />
        </div>

        <StockfishSettings
            :stockfish-options="stockfishOptions"
            @change-depth="changeStockfishDepth"
            @change-level="changeStockfishLevel"
            @change-max-error="changeStockfishMaxError"
            @change-probability="changeStockfishProbability"
        />
    </div>

    <div class="center">
        <BoardEval
            :material-diff="boardAPI?.getMaterialCount().materialDiff || 0"
            :evaluation="evaluation"
            :best-move="bestMove"
        />

        <TheChessboard
            :board-config="boardConfig"
            @board-created="createBoard"
            @move="(move) => parseMove(move)"
        ></TheChessboard>
        <BoardButtons
            @toggle-moves="boardAPI?.toggleMoves()"
            @toggle-orientation="boardAPI?.toggleOrientation()"
        />
    </div>

    <div class="sidebar-right">
        <MoveHistory :history="history" />
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
</style>
