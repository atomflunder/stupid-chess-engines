import { Chess } from 'chess.js';
import type { AlgorithmVars } from '../algorithms';
import { makeMove } from '../move';
import { randomMove } from './random';
import { calculateDistance } from '../distance';

/**
 * This algorithm will always try to move their king as close to the enemy king as possible.
 * If no king move is possible we just do a random one.
 */
export function infiltrationMove(algorithmVars: AlgorithmVars) {
    const board = algorithmVars.chess.board();

    const moves = algorithmVars.chess.moves();

    const kingMoves = moves.filter((s) => s.toLowerCase().indexOf('k') !== -1);

    if (kingMoves.length === 0) {
        randomMove(algorithmVars);
        return;
    }

    let enemyKingSquare = undefined;
    board.forEach((row) => {
        row.forEach((sq) => {
            if (sq?.type === 'k' && sq.color !== algorithmVars.chess.turn()) {
                enemyKingSquare = sq;
            }
        });
    });

    const moveDistances = [];

    for (let x = 0; x < kingMoves.length; x++) {
        const m = kingMoves[x];

        const newChess = new Chess(algorithmVars.chess.fen());
        newChess.move(m);

        let kingSquare = undefined;
        board.forEach((row) => {
            row.forEach((sq) => {
                if (sq?.type === 'k' && sq.color === algorithmVars.chess.turn()) {
                    kingSquare = sq;
                }
            });
        });

        // @ts-ignore
        moveDistances.push(calculateDistance(enemyKingSquare.square, kingSquare.square));
    }

    const minDistance = Math.min(...moveDistances);
    const index = moveDistances.indexOf(minDistance);

    const move = kingMoves[index];

    makeMove(move, algorithmVars.chess, algorithmVars.boardAPI);
}
