import type { Chess } from 'chess.js';
import type { BoardApi } from 'vue3-chessboard';

/**
 * This algorithm will always try to checkmate the opponent.
 * If this is not possible it will try to check the opponent,
 * and if that is impossible it will try to take an enemy piece.
 * If that is also not possible we just make a random move.
 */
function getMove(chess: Chess): string {
    const moves = chess.moves();

    const checkmateMoves = moves.filter((s) => s.indexOf('#') !== -1);

    if (checkmateMoves.length > 0) {
        const randMove = checkmateMoves[Math.floor(Math.random() * checkmateMoves.length)];

        return randMove;
    }

    const checkMoves = moves.filter((s) => s.indexOf('+') !== -1);

    if (checkMoves.length > 0) {
        const randMove = checkMoves[Math.floor(Math.random() * checkmateMoves.length)];

        return randMove;
    }

    const takeMoves = moves.filter((s) => s.indexOf('x') !== -1);

    const randMove =
        takeMoves.length > 0
            ? takeMoves[Math.floor(Math.random() * takeMoves.length)]
            : moves[Math.floor(Math.random() * moves.length)];

    return randMove;
}

export function warMove(boardAPI: BoardApi, chess: Chess) {
    const move = getMove(chess);

    boardAPI.move(move);
    chess.move(move);
}

export function warMoveHeadless(chess: Chess) {
    const move = getMove(chess);

    chess.move(move);
}
