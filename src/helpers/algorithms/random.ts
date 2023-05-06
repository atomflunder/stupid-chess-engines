import { makeMove } from '../move';
import type { AlgorithmVars } from '../algorithms';

/**
 * This algorithm will make a random move.
 */
export function randomMove(algorithmVars: AlgorithmVars) {
    const moves = algorithmVars.chess.moves();

    const move = moves[Math.floor(Math.random() * moves.length)];

    makeMove(move, algorithmVars.chess, algorithmVars.boardAPI);
}
