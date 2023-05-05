import type { Chess } from 'chess.js';
import type { BoardApi } from 'vue3-chessboard';

/**
 * This algorithm will try to only move their pieces on dark squares, if possible.
 */
export function blackMove(chess: Chess, boardAPI: BoardApi | null = null) {
    const moves = chess.moves({ verbose: true });

    const blackMoves = moves.filter((move) => chess.squareColor(move.to) === 'dark');

    const move =
        blackMoves.length > 0
            ? blackMoves[Math.floor(Math.random() * blackMoves.length)]
            : moves[Math.floor(Math.random() * moves.length)];

    if (boardAPI) {
        boardAPI.move(move.san);
    }
    chess.move(move.san);
}
