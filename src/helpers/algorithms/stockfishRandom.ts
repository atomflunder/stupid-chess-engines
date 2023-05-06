import type { AlgorithmVars } from '../algorithms';
import { stockfishMove } from './stockfish';
import { randomMove } from './random';

/**
 * This algorithm will ask Stockfish 11 for the best move 50% of the time, and 50% of the time it will move randomly.
 * Also not recommended to be ran in the background, just like the real deal
 */
export function stockfishRandomMove(algorithmVars: AlgorithmVars) {
    const coinflip = Math.floor(Math.random() * 2) == 0;

    if (coinflip) {
        stockfishMove(algorithmVars);
    } else {
        randomMove(algorithmVars);
    }
}
