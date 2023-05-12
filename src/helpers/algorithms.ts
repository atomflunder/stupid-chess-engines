import type { Chess } from 'chess.js';
import type { BoardApi } from 'vue3-chessboard';

import { blackMove } from './algorithms/black';
import { firstMove } from './algorithms/first';
import { kingMove } from './algorithms/king';
import { longestMove } from './algorithms/longest';
import { pacifistMove } from './algorithms/pacifist';
import { pawnMove } from './algorithms/pawn';
import { randomMove } from './algorithms/random';
import { warMove } from './algorithms/war';
import { whiteMove } from './algorithms/white';
import { stockfishMove } from './algorithms/stockfish';
import { stockfishRandomMove } from './algorithms/stockfishRandom';
import { swarmMove } from './algorithms/swarm';
import { cuddleMove } from './algorithms/cuddle';
import { infiltrationMove } from './algorithms/infiltration';
import { panicfishMove } from './algorithms/panicfish';
import { lawyerMove } from './algorithms/lawyer';
import { criminalMove } from './algorithms/criminal';
import { trueRandomMove } from './algorithms/trueRandom';
import { lowscoreMove } from './algorithms/lowscore';
import { highscoreMove } from './algorithms/highscore';
import { gambitMove } from './algorithms/gambit';
import { stockfishopponentMove } from './algorithms/stockfishOpponent';

export interface AlgorithmVars {
    chess: Chess;
    boardAPI?: BoardApi;
    eval?: string;
    bestMove?: string;
    ponderMove?: string;
    stockfishWorker?: Worker;
    stockfishOptions?: StockfishOptions;
}

export interface StockfishOptions {
    level: number;
    depth: number;
    maxError: number;
    probability: number;
    fen: string;
}

export const allAlgorithms = {
    none: {
        name: 'None (Player Controlled)',
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        algorithm: (_algorithmVars: AlgorithmVars): void => {}
    },

    random: {
        name: 'Random',
        algorithm: randomMove
    },

    trueRandom: {
        name: 'True Random',
        algorithm: trueRandomMove
    },

    first: {
        name: 'First Move Sorted',
        algorithm: firstMove
    },

    pawn: {
        name: 'Pawn Pusher',
        algorithm: pawnMove
    },

    war: {
        name: 'Aggressive',
        algorithm: warMove
    },

    swarm: {
        name: 'Swarm King',
        algorithm: swarmMove
    },

    pacifist: {
        name: 'Pacifist',
        algorithm: pacifistMove
    },

    cuddle: {
        name: 'Cuddle King',
        algorithm: cuddleMove
    },

    infiltration: {
        name: 'King Infiltration',
        algorithm: infiltrationMove
    },

    gambit: {
        name: 'Gambit',
        algorithm: gambitMove
    },

    longest: {
        name: 'Longest Move',
        algorithm: longestMove
    },

    king: {
        name: 'Battle King',
        algorithm: kingMove
    },

    black: {
        name: 'Black Squares',
        algorithm: blackMove
    },

    white: {
        name: 'White Squares',
        algorithm: whiteMove
    },

    lawyer: {
        name: 'Lawyer',
        algorithm: lawyerMove
    },

    criminal: {
        name: 'Criminal',
        algorithm: criminalMove
    },

    highScore: {
        name: 'High Score',
        algorithm: highscoreMove
    },

    lowScore: {
        name: 'Low Score',
        algorithm: lowscoreMove
    },

    stockfish: {
        name: 'Stockfish 11',
        algorithm: stockfishMove
    },

    panicfish: {
        name: 'Panicfish',
        algorithm: panicfishMove
    },

    stockfishOpponent: {
        name: 'Stockfish Opponent',
        algorithm: stockfishopponentMove
    },

    stockfishRandom: {
        name: 'Stockfish / Random',
        algorithm: stockfishRandomMove
    }
};
