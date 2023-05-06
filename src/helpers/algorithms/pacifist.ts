import type { AlgorithmVars } from '../algorithms';
import { makeMove } from '../move';

/**
 * This algorithm will always try to avoid checkmating, avoid checking and avoid taking pieces.
 * If that is not possible we just make a random move.
 */
export function pacifistMove(algorithmVars: AlgorithmVars) {
    const moves = algorithmVars.chess.moves();

    let pacifistMoves = moves.filter((s) => s.indexOf('#') === -1);
    pacifistMoves = moves.filter((s) => s.indexOf('+') === -1);
    pacifistMoves = moves.filter((s) => s.indexOf('x') === -1);

    const move =
        pacifistMoves.length > 0
            ? pacifistMoves[Math.floor(Math.random() * pacifistMoves.length)]
            : moves[Math.floor(Math.random() * moves.length)];

    makeMove(move, algorithmVars.chess, algorithmVars.boardAPI);
}
