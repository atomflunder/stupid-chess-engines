import { makeMove } from '../move';
import type { AlgorithmVars } from '../algorithms';

/**
 * This algorithm will ask Stockfish 11 for the best move.
 * Stockfish 11 has an Elo score of around 3468, but we are "only" running it with a depth of 10.
 */
export function stockfishMove(algorithmVars: AlgorithmVars) {
    makeMove(algorithmVars.bestMove!, algorithmVars.chess, algorithmVars.boardAPI!);
}
