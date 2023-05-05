import type { Chess } from 'chess.js';
import type { BoardApi } from 'vue3-chessboard';

/**
 * This algorithm will try to only move their pieces on white squares, if possible.
 */
export function whiteMove(chess: Chess, boardAPI: BoardApi | null = null) {
    const moves = chess.moves({ verbose: true });

    const whiteMoves = moves.filter((move) => chess.squareColor(move.to) === 'light');

    const move =
        whiteMoves.length > 0
            ? whiteMoves[Math.floor(Math.random() * whiteMoves.length)]
            : moves[Math.floor(Math.random() * moves.length)];

    if (boardAPI) {
        boardAPI.move(move.san);
    }
    chess.move(move.san);
}
