import type { Chess } from 'chess.js';
import type { BoardApi } from 'vue3-chessboard';

/**
 * This algorithm will just make the first move sorted.
 */
function getMove(chess: Chess): string {
    const moves = chess.moves();

    moves.sort();

    return moves[0];
}

export function firstMove(boardAPI: BoardApi, chess: Chess) {
    const move = getMove(chess);

    boardAPI.move(move);
    chess.move(move);
}

export function firstMoveHeadless(chess: Chess) {
    const move = getMove(chess);

    chess.move(move);
}
