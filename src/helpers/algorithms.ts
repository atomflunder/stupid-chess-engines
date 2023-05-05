import { firstMove } from './algorithms/first';
import { kingMove } from './algorithms/king';
import { longestMove } from './algorithms/longest';
import { pacifistMove } from './algorithms/pacifist';
import { pawnMove } from './algorithms/pawn';
import { randomMove } from './algorithms/random';
import { warMove } from './algorithms/war';

export const allAlgorithms = {
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
    }
};
