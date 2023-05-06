import type { AlgorithmVars } from '../algorithms';
import { makeMove } from '../move';

/**
 * This algorithm will try to only move their pieces on white squares, if possible.
 */
export function whiteMove(algorithmVars: AlgorithmVars) {
    const moves = algorithmVars.chess.moves({ verbose: true });

    const whiteMoves = moves.filter((move) => algorithmVars.chess.squareColor(move.to) === 'light');

    const move =
        whiteMoves.length > 0
            ? whiteMoves[Math.floor(Math.random() * whiteMoves.length)]
            : moves[Math.floor(Math.random() * moves.length)];

    makeMove(move.san, algorithmVars.chess, algorithmVars.boardAPI);
}
