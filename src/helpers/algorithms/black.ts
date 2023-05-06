import { makeMove } from '../move';
import type { AlgorithmVars } from '../algorithms';

/**
 * This algorithm will try to only move their pieces on dark squares, if possible.
 */
export function blackMove(algorithmVars: AlgorithmVars) {
    const moves = algorithmVars.chess.moves({ verbose: true });

    const blackMoves = moves.filter((move) => algorithmVars.chess.squareColor(move.to) === 'dark');

    const move =
        blackMoves.length > 0
            ? blackMoves[Math.floor(Math.random() * blackMoves.length)]
            : moves[Math.floor(Math.random() * moves.length)];

    if (!move) {
        return;
    }

    makeMove(move.san, algorithmVars.chess, algorithmVars.boardAPI);
}
