import type { Chess } from 'chess.js';
import type { BoardApi } from 'vue3-chessboard';

/**
 * This algorithm will make a random move.
 */
export function randomMove(boardAPI: BoardApi, chess: Chess) {
    const move = getMove(chess);

    boardAPI.move(move);
    chess.move(move);
}

export function randomMoveHeadless(chess: Chess) {
    const move = getMove(chess);

    chess.move(move);
}

function getMove(chess: Chess): string {
    const moves = chess.moves();

    const randMove = moves[Math.floor(Math.random() * moves.length)];

    return randMove;
}
