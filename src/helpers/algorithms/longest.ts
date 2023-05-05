import type { Chess } from 'chess.js';
import type { BoardApi } from 'vue3-chessboard';

/**
 * This algorithm will just make the longest possible move in standard notation.
 */
export function longestMove(chess: Chess, boardAPI: BoardApi | null = null) {
    const moves = chess.moves();

    moves.sort((a, b) => b.length - a.length);

    if (boardAPI) {
        boardAPI.move(moves[0]);
    }
    chess.move(moves[0]);
}
