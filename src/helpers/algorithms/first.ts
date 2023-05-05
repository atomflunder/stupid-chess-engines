import type { Chess } from 'chess.js';
import type { BoardApi } from 'vue3-chessboard';

/**
 * This algorithm will just make the first move sorted.
 */
export function firstMove(chess: Chess, boardAPI: BoardApi | null = null) {
    const moves = chess.moves();

    moves.sort();

    if (boardAPI) {
        boardAPI.move(moves[0]);
    }
    chess.move(moves[0]);
}
