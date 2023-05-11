import { Chess } from 'chess.js';
import type { AlgorithmVars } from '../algorithms';
import { makeMove } from '../move';

/**
 * This algorithm will always try to give their opponent the fewest amount of legal moves possible.
 */
export function criminalMove(algorithmVars: AlgorithmVars) {
    const moves = algorithmVars.chess.moves();

    const possibleMoves = [];

    for (let x = 0; x < moves.length; x++) {
        const m = moves[x];

        const newChess = new Chess(algorithmVars.chess.fen());
        newChess.move(m);

        possibleMoves.push(newChess.moves().length);
    }

    const minMoves = Math.min(...possibleMoves);
    const index = possibleMoves.indexOf(minMoves);

    const move = moves[index];

    makeMove(move, algorithmVars.chess, algorithmVars.boardAPI);
}
