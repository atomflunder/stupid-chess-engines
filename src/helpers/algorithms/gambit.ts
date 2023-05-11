import { Chess } from 'chess.js';
import type { AlgorithmVars } from '../algorithms';
import { makeMove } from '../move';

/**
 * This algorithm will try to offer up as many pieces for capture as possible.
 */
export function gambitMove(algorithmVars: AlgorithmVars) {
    const moves = algorithmVars.chess.moves();

    const piecesOffered = [];

    for (let x = 0; x < moves.length; x++) {
        const m = moves[x];

        const newChess = new Chess(algorithmVars.chess.fen());
        newChess.move(m);

        const captureMoves = newChess.moves().filter((m) => m.indexOf('x') !== -1);

        piecesOffered.push(captureMoves.length);
    }

    const maxScore = Math.max(...piecesOffered);
    const index = piecesOffered.indexOf(maxScore);

    const move = moves[index];

    makeMove(move, algorithmVars.chess, algorithmVars.boardAPI);
}
