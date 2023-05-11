import { makeMove } from '../move';
import type { AlgorithmVars } from '../algorithms';
import { randomMove } from './random';

/**
 * This algorithm will ask Stockfish 11 for the best move, but it will pretend it is the opponents turn.
 */
export function stockfishopponentMove(algorithmVars: AlgorithmVars) {
    const modifiedFen = algorithmVars.chess.fen().split(' ');

    modifiedFen[1] = algorithmVars.chess.turn() === 'w' ? 'b' : 'w';

    algorithmVars.stockfishWorker?.postMessage(`position fen ${modifiedFen.join(' ')}`);
    algorithmVars.stockfishWorker?.postMessage(`go depth ${algorithmVars.depth}`);

    // If there is a M1 threat, stockfish will leave the move as undefined.

    if (algorithmVars.ponderMove) {
        makeMove(algorithmVars.ponderMove!, algorithmVars.chess, algorithmVars.boardAPI!);
    } else {
        // So we just make a random move then.
        randomMove(algorithmVars);
    }
}
