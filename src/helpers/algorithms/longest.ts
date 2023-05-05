import type { Chess } from 'chess.js';
import type { BoardApi } from 'vue3-chessboard';
import { makeMove } from '../move';

/**
 * This algorithm will just make the longest possible move in standard notation.
 */
export function longestMove(chess: Chess, boardAPI: BoardApi | null = null) {
    const moves = chess.moves();

    moves.sort((a, b) => b.length - a.length);

    makeMove(moves[0], chess, boardAPI);
}
