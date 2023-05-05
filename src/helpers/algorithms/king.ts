import type { Chess } from 'chess.js';
import type { BoardApi } from 'vue3-chessboard';
import { makeMove } from '../move';

/**
 * This algorithm will always try to move their King.
 * If that is not possible we just make a random move.
 */
export function kingMove(chess: Chess, boardAPI: BoardApi | null = null) {
    const moves = chess.moves();

    const kingMoves = moves.filter((s) => s.indexOf('K') !== -1);

    const move =
        kingMoves.length > 0
            ? kingMoves[Math.floor(Math.random() * kingMoves.length)]
            : moves[Math.floor(Math.random() * moves.length)];

    makeMove(move, chess, boardAPI);
}
