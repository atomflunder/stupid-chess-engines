import { makeMove } from '../move';
import type { AlgorithmVars } from '../algorithms';

/**
 * This algorithm will just make the first move sorted.
 */
export function firstMove(algorithmVars: AlgorithmVars) {
    const moves = algorithmVars.chess.moves();

    moves.sort();

    makeMove(moves[0], algorithmVars.chess, algorithmVars.boardAPI);
}
