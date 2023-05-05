import type { Chess } from 'chess.js';
import type { BoardApi } from 'vue3-chessboard';

/**
 * This algorithm will just make the longest possible move in standard notation.
 */
function getMove(chess: Chess): string {
    const moves = chess.moves();

    moves.sort((a, b) => b.length - a.length);

    return moves[0];
}

export function longestMove(boardAPI: BoardApi, chess: Chess) {
    const move = getMove(chess);

    boardAPI.move(move);
    chess.move(move);
}

export function longestMoveHeadless(chess: Chess) {
    const move = getMove(chess);

    chess.move(move);
}
