import { Chess } from 'chess.js';
import type { AlgorithmVars } from '../algorithms';
import { makeMove } from '../move';

/**
 * This algorithm will look at the board in binary and makes the move that yields the highest number.
 */
export function highscoreMove(algorithmVars: AlgorithmVars) {
    const moves = algorithmVars.chess.moves();

    const moveScores = [];

    for (let x = 0; x < moves.length; x++) {
        const m = moves[x];

        const newChess = new Chess(algorithmVars.chess.fen());
        newChess.move(m);

        let binaryString = '';

        const board = newChess.board();

        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                if (board[i][j]) {
                    binaryString = binaryString + '1';
                } else {
                    binaryString = binaryString + '0';
                }
            }
        }

        moveScores.push(parseInt(binaryString, 2));
    }

    const maxScore = Math.max(...moveScores);
    const index = moveScores.indexOf(maxScore);

    const move = moves[index];

    makeMove(move, algorithmVars.chess, algorithmVars.boardAPI);
}
