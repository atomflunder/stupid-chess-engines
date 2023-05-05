import type { Chess } from 'chess.js';
import type { BoardApi } from 'vue3-chessboard';
import { makeMove } from '../move';

/**
 * This algorithm will always try to avoid checkmating, avoid checking and avoid taking pieces.
 * If that is not possible we just make a random move.
 */
export function pacifistMove(chess: Chess, boardAPI: BoardApi | null = null) {
    const moves = chess.moves();

    let pacifistMoves = moves.filter((s) => s.indexOf('#') === -1);
    pacifistMoves = moves.filter((s) => s.indexOf('+') === -1);
    pacifistMoves = moves.filter((s) => s.indexOf('x') === -1);

    const move =
        pacifistMoves.length > 0
            ? pacifistMoves[Math.floor(Math.random() * pacifistMoves.length)]
            : moves[Math.floor(Math.random() * moves.length)];

    makeMove(move, chess, boardAPI);
}
