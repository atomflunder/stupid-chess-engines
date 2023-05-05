import type { Chess } from 'chess.js';
import { blackMove } from './algorithms/black';
import { firstMove } from './algorithms/first';
import { kingMove } from './algorithms/king';
import { longestMove } from './algorithms/longest';
import { pacifistMove } from './algorithms/pacifist';
import { pawnMove } from './algorithms/pawn';
import { randomMove } from './algorithms/random';
import { warMove } from './algorithms/war';
import { whiteMove } from './algorithms/white';
import type { BoardApi } from 'vue3-chessboard';
import { stockfishMove } from './algorithms/stockfish';

export const allAlgorithms = {
    none: {
        name: 'None',
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        algorithm: (_chess: Chess, _boardAPI: BoardApi | null = null): void => {}
    },

    random: {
        name: 'Random',
        algorithm: randomMove
    },

    first: {
        name: 'First',
        algorithm: firstMove
    },

    pawn: {
        name: 'Pawn',
        algorithm: pawnMove
    },

    war: {
        name: 'War',
        algorithm: warMove
    },

    pacifist: {
        name: 'Pacifist',
        algorithm: pacifistMove
    },

    longest: {
        name: 'Longest',
        algorithm: longestMove
    },

    king: {
        name: 'King',
        algorithm: kingMove
    },

    black: {
        name: 'Black',
        algorithm: blackMove
    },

    white: {
        name: 'White',
        algorithm: whiteMove
    },

    stockfish: {
        name: 'Stockfish 11',
        algorithm: stockfishMove
    }
};
