import { makeMove } from '../move';
import type { AlgorithmVars } from '../algorithms';

/**
 * This algorithm will always try to move their King.
 * If that is not possible we just make a random move.
 */
export function kingMove(algorithmVars: AlgorithmVars) {
    const moves = algorithmVars.chess.moves();

    const kingMoves = moves.filter((s) => s.indexOf('K') !== -1);

    const move =
        kingMoves.length > 0
            ? kingMoves[Math.floor(Math.random() * kingMoves.length)]
            : moves[Math.floor(Math.random() * moves.length)];

    makeMove(move, algorithmVars.chess, algorithmVars.boardAPI);
}
