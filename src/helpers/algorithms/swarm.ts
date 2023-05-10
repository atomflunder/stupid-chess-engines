import { Chess } from 'chess.js';
import type { AlgorithmVars } from '../algorithms';
import { makeMove } from '../move';
import { calculateDistance } from '../distance';

/**
 * This algorithm will always try to move their pieces as close to the enemy king as possible.
 */
export function swarmMove(algorithmVars: AlgorithmVars) {
    const board = algorithmVars.chess.board();

    const moves = algorithmVars.chess.moves();

    let enemyKingSquare = undefined;
    board.forEach((row) => {
        row.forEach((sq) => {
            if (sq?.type === 'k' && sq.color !== algorithmVars.chess.turn()) {
                enemyKingSquare = sq;
            }
        });
    });

    const moveDistances = [];

    for (let x = 0; x < moves.length; x++) {
        const m = moves[x];

        const newChess = new Chess(algorithmVars.chess.fen());
        newChess.move(m);

        let sumOfDistance = 0;

        for (let i = 0; i < newChess.board().length; i++) {
            for (let j = 0; j < newChess.board()[i].length; j++) {
                if (
                    newChess.board()[i][j]?.color === algorithmVars.chess.turn() &&
                    enemyKingSquare !== undefined &&
                    newChess.board()[i][j] !== undefined
                ) {
                    sumOfDistance += calculateDistance(
                        // @ts-ignore
                        enemyKingSquare.square,
                        newChess.board()[i][j]?.square!
                    );
                }
            }
        }

        moveDistances.push(sumOfDistance);
    }

    const minDistance = Math.min(...moveDistances);
    const index = moveDistances.indexOf(minDistance);

    const move = moves[index];

    makeMove(move, algorithmVars.chess, algorithmVars.boardAPI);
}
