import type { Chess } from 'chess.js';
import type { BoardApi } from 'vue3-chessboard';

/**
 * This algorithm will always try to move their pawns.
 * If that is not possible we just make a random move.
 */
export function pawnMove(chess: Chess, boardAPI: BoardApi | null = null) {
    const moves = chess.moves({ verbose: true });

    const pawnMoves = moves.filter((s) => s.piece === 'p');

    const move =
        pawnMoves.length > 0
            ? pawnMoves[Math.floor(Math.random() * pawnMoves.length)]
            : moves[Math.floor(Math.random() * moves.length)];

    if (boardAPI) {
        boardAPI.move(move.san);
    }
    chess.move(move.san);
}
