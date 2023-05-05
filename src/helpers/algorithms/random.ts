import type { Chess } from 'chess.js';
import type { BoardApi } from 'vue3-chessboard';

/**
 * This algorithm will make a random move.
 */
export function randomMove(chess: Chess, boardAPI: BoardApi | null = null) {
    const moves = chess.moves();

    const move = moves[Math.floor(Math.random() * moves.length)];

    if (boardAPI) {
        boardAPI.move(move);
    }
    chess.move(move);
}
