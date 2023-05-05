import { firstMove, firstMoveHeadless } from './algorithms/first';
import { longestMove, longestMoveHeadless } from './algorithms/longest';
import { pacifistMove, pacifistMoveHeadless } from './algorithms/pacifist';
import { pawnMove, pawnMoveHeadless } from './algorithms/pawn';
import { randomMove, randomMoveHeadless } from './algorithms/random';
import { warMove, warMoveHeadless } from './algorithms/war';

export const allAlgorithms = {
    random: {
        name: 'Random',
        algorithm: randomMove,
        algorithmHeadless: randomMoveHeadless
    },

    first: {
        name: 'First',
        algorithm: firstMove,
        algorithmHeadless: firstMoveHeadless
    },

    pawn: {
        name: 'Pawn',
        algorithm: pawnMove,
        algorithmHeadless: pawnMoveHeadless
    },

    war: {
        name: 'War',
        algorithm: warMove,
        algorithmHeadless: warMoveHeadless
    },

    pacifist: {
        name: 'Pacifist',
        algorithm: pacifistMove,
        algorithmHeadless: pacifistMoveHeadless
    },

    longest: {
        name: 'Longest',
        algorithm: longestMove,
        algorithmHeadless: longestMoveHeadless
    }
};
