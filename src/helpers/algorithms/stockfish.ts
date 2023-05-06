import { makeMove } from '../move';
import type { AlgorithmVars } from '../algorithms';

/**
 * This algorithm will ask Stockfish 11 for the best move.
 * Stockfish 11 has an Elo score of around 3468, but we are "only" running it with a depth of 10.
 * Not recommended to be ran in the background, as it is "pretty CPU intensive" to run hundreds stockfish instances at once.
 */
export function stockfishMove(algorithmVars: AlgorithmVars) {
    const stockfishThread = new Worker('./src/stockfish/src/stockfish.js');
    stockfishThread.postMessage('ucinewgame');

    stockfishThread.postMessage(`position fen ${algorithmVars.chess.fen()}`);
    stockfishThread.postMessage(`go depth ${algorithmVars.stockfishDepth}`);

    function move(event: MessageEvent) {
        if (event.data.includes('bestmove')) {
            const bestMove = event.data.split(' ')[1];

            makeMove(bestMove, algorithmVars.chess, algorithmVars.boardAPI);

            removeEventListener('message', move);
        }
    }

    stockfishThread.addEventListener('message', move);

    // TODO: Make this more efficient
}
