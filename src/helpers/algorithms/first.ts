import type { Chess } from 'chess.js';
import type { BoardApi } from 'vue3-chessboard';
import { makeMove } from '../move';

/**
 * This algorithm will just make the first move sorted.
 */
export function firstMove(chess: Chess, boardAPI: BoardApi | null = null) {
    const moves = chess.moves();

    moves.sort();

    makeMove(moves[0], chess, boardAPI);
}
