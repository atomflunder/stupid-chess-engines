import { makeMove } from '../move';
import type { AlgorithmVars } from '../algorithms';

/**
 * This algorithm will just make the longest possible move in standard notation.
 */
export function longestMove(algorithmVars: AlgorithmVars) {
    const moves = algorithmVars.chess.moves();

    moves.sort((a, b) => b.length - a.length);

    makeMove(moves[0], algorithmVars.chess, algorithmVars.boardAPI);
}
