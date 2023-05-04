import type { Chess } from 'chess.js';
import type { BoardApi } from 'vue3-chessboard';

/**
 * This algorithm will always try to move their pawns.
 * If that is not possible we just make a random move.
 */
function getMove(chess: Chess): string {
    const moves = chess.moves();

    const pawnMoves = moves.filter((s) => s === s.toLowerCase());

    const randMove =
        pawnMoves.length > 0
            ? pawnMoves[Math.floor(Math.random() * pawnMoves.length)]
            : moves[Math.floor(Math.random() * moves.length)];

    return randMove;
}

export function pawnMove(boardAPI: BoardApi, chess: Chess) {
    const move = getMove(chess);

    boardAPI.move(move);
    chess.move(move);
}

export function pawnMoveHeadless(chess: Chess) {
    const move = getMove(chess);

    chess.move(move);
}
