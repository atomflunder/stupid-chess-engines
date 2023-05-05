import type { Chess } from 'chess.js';
import type { BoardApi } from 'vue3-chessboard';
import { makeMove } from '../move';

/**
 * This algorithm will make a random move.
 */
export function randomMove(chess: Chess, boardAPI: BoardApi | null = null) {
    const moves = chess.moves();

    const move = moves[Math.floor(Math.random() * moves.length)];

    makeMove(move, chess, boardAPI);
}
