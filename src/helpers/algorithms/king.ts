import type { Chess } from 'chess.js';
import type { BoardApi } from 'vue3-chessboard';

/**
 * This algorithm will always try to move their King.
 * If that is not possible we just make a random move.
 */
function getMove(chess: Chess): string {
    const moves = chess.moves();

    const kingMoves = moves.filter((s) => s.indexOf('K') !== -1);

    const randMove =
        kingMoves.length > 0
            ? kingMoves[Math.floor(Math.random() * kingMoves.length)]
            : moves[Math.floor(Math.random() * moves.length)];

    return randMove;
}

export function kingMove(boardAPI: BoardApi, chess: Chess) {
    const move = getMove(chess);

    boardAPI.move(move);
    chess.move(move);
}

export function kingMoveHeadless(chess: Chess) {
    const move = getMove(chess);

    chess.move(move);
}
