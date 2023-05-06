import { makeMove } from '../move';
import type { AlgorithmVars } from '../algorithms';

/**
 * This algorithm will ask Stockfish 11 for the best move.
 * Stockfish 11 has an Elo score of around 3468, but we are "only" running it with a depth of 10.
 * Not recommended to be ran in the background, as it is "pretty CPU intensive" to run 100/200 stockfish instances at once.
 */
export function stockfishMove(algorithmVars: AlgorithmVars) {
    // If we run the algorithm headless, we need to post some more messages.
    // In the visual game we post these messages anyways for the evaluation, no matter the algorithm,
    // but here we need to do this only when the Stockfish 11 algorithm is actually used.
    if (!algorithmVars.boardAPI) {
        algorithmVars.stockfishWorker!.postMessage(`position fen ${algorithmVars.chess.fen()}`);
        algorithmVars.stockfishWorker!.postMessage(`go depth ${algorithmVars.stockfishDepth}`);
    }

    algorithmVars.stockfishWorker!.addEventListener('message', (event) => {
        if (event.data.includes('bestmove')) {
            const bestMove = event.data.split(' ')[1];

            makeMove(bestMove, algorithmVars.chess, algorithmVars.boardAPI);
        }
    });
}
