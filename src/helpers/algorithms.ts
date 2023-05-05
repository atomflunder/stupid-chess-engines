import { firstMove, firstMoveHeadless } from './algorithms/first';
import { pacifistMove, pacifistMoveHeadless } from './algorithms/pacifist';
import { pawnMove, pawnMoveHeadless } from './algorithms/pawn';
import { randomMove, randomMoveHeadless } from './algorithms/random';
import { warMove, warMoveHeadless } from './algorithms/war';

export enum Algorithms {
    Random,
    First,
    Pawn,
    War,
    Pacifist
}

export const allAlgorithms = {
    random: {
        type: Algorithms.Random,
        algorithm: randomMove,
        algorithmHeadless: randomMoveHeadless,
        name: 'Random'
    },

    first: {
        type: Algorithms.First,
        algorithm: firstMove,
        algorithmHeadless: firstMoveHeadless,
        name: 'First'
    },

    pawn: {
        type: Algorithms.Pawn,
        algorithm: pawnMove,
        algorithmHeadless: pawnMoveHeadless,
        name: 'Pawn'
    },

    war: {
        type: Algorithms.War,
        algorithm: warMove,
        algorithmHeadless: warMoveHeadless,
        name: 'War'
    },

    pacifist: {
        type: Algorithms.Pacifist,
        algorithm: pacifistMove,
        algorithmHeadless: pacifistMoveHeadless,
        name: 'Pacifist'
    }
};
