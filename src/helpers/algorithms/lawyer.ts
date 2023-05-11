import { Chess } from 'chess.js';
import type { AlgorithmVars } from '../algorithms';
import { makeMove } from '../move';

/**
 * This algorithm will always try to give their opponent the most amount of legal moves possible.
 */
export function lawyerMove(algorithmVars: AlgorithmVars) {
    const moves = algorithmVars.chess.moves();

    const possibleMoves = [];

    for (let x = 0; x < moves.length; x++) {
        const m = moves[x];

        const newChess = new Chess(algorithmVars.chess.fen());
        newChess.move(m);

        possibleMoves.push(newChess.moves().length);
    }

    const maxMoves = Math.max(...possibleMoves);
    const index = possibleMoves.indexOf(maxMoves);

    const move = moves[index];

    makeMove(move, algorithmVars.chess, algorithmVars.boardAPI);
}
