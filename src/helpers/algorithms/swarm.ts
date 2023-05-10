import { Chess } from 'chess.js';
import type { AlgorithmVars } from '../algorithms';
import { makeMove } from '../move';

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

    function calculateDistance(sq1: string, sq2: string): number {
        const x1 = sq1.charCodeAt(0) - 96;
        const x2 = Number(sq1.charAt(1));

        const y1 = sq2.charCodeAt(0) - 96;
        const y2 = Number(sq2.charAt(1));

        // The Chebyshev Distance
        return Math.max(Math.abs(y1 - x1), Math.abs(y2 - x2));
    }

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

        console.log(m, sumOfDistance);

        moveDistances.push(sumOfDistance);
    }

    const minDistance = Math.min(...moveDistances);
    const index = moveDistances.indexOf(minDistance);

    const move = moves[index];

    makeMove(move, algorithmVars.chess, algorithmVars.boardAPI);
}
