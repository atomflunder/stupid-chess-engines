import type { Chess } from 'chess.js';
import type { BoardApi } from 'vue3-chessboard';
import { makeMove } from '../move';

/**
 * This algorithm will always try to checkmate the opponent.
 * If this is not possible it will try to check the opponent,
 * and if that is impossible it will try to take an enemy piece.
 * If that is also not possible we just make a random move.
 */
export function warMove(chess: Chess, boardAPI: BoardApi | null = null) {
    const moves = chess.moves();

    const checkmateMoves = moves.filter((s) => s.indexOf('#') !== -1);

    if (checkmateMoves.length > 0) {
        const move = checkmateMoves[Math.floor(Math.random() * checkmateMoves.length)];

        makeMove(move, chess, boardAPI);
        return;
    }

    const checkMoves = moves.filter((s) => s.indexOf('+') !== -1);

    if (checkMoves.length > 0) {
        const move = checkMoves[Math.floor(Math.random() * checkmateMoves.length)];

        makeMove(move, chess, boardAPI);
        return;
    }

    const takeMoves = moves.filter((s) => s.indexOf('x') !== -1);

    const move =
        takeMoves.length > 0
            ? takeMoves[Math.floor(Math.random() * takeMoves.length)]
            : moves[Math.floor(Math.random() * moves.length)];

    makeMove(move, chess, boardAPI);
}
