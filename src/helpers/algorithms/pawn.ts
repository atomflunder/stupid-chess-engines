import { makeMove } from '../move';
import type { AlgorithmVars } from '../algorithms';

/**
 * This algorithm will always try to move their pawns.
 * If that is not possible we just make a random move.
 */
export function pawnMove(algorithmVars: AlgorithmVars) {
    const moves = algorithmVars.chess.moves({ verbose: true });

    const pawnMoves = moves.filter((s) => s.piece === 'p');

    const move =
        pawnMoves.length > 0
            ? pawnMoves[Math.floor(Math.random() * pawnMoves.length)]
            : moves[Math.floor(Math.random() * moves.length)];

    makeMove(move.san, algorithmVars.chess, algorithmVars.boardAPI);
}
