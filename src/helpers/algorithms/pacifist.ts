import type { Chess } from 'chess.js';
import type { BoardApi } from 'vue3-chessboard';

/**
 * This algorithm will always try to avoid checkmating, avoid checking and avoid taking pieces.
 * If that is not possible we just make a random move.
 */
function getMove(chess: Chess): string {
    const moves = chess.moves();

    let pacifistMoves = moves.filter((s) => s.indexOf('#') === -1);
    pacifistMoves = moves.filter((s) => s.indexOf('+') === -1);
    pacifistMoves = moves.filter((s) => s.indexOf('x') === -1);

    const randMove =
        pacifistMoves.length > 0
            ? pacifistMoves[Math.floor(Math.random() * pacifistMoves.length)]
            : moves[Math.floor(Math.random() * moves.length)];

    return randMove;
}

export function pacifistMove(boardAPI: BoardApi, chess: Chess) {
    const move = getMove(chess);

    boardAPI.move(move);
    chess.move(move);
}

export function pacifistMoveHeadless(chess: Chess) {
    const move = getMove(chess);

    chess.move(move);
}
