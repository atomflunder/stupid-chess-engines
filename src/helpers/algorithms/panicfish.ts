import type { AlgorithmVars } from '../algorithms';
import { randomMove } from './random';
import { stockfishMove } from './stockfish';

/**
 * This algorithm will ask Stockfish for the best move, but if it is in check, it will do a random move.
 */
export function panicfishMove(algorithmVars: AlgorithmVars) {
    if (algorithmVars.chess.inCheck()) {
        randomMove(algorithmVars);
    } else {
        stockfishMove(algorithmVars);
    }
}
