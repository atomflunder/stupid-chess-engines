import type { Chess } from 'chess.js';
import type { BoardApi } from 'vue3-chessboard';
import { makeMove } from '../move';

const stockfish = new Worker('./src/stockfish/src/stockfish.js');
stockfish.postMessage('uci');
stockfish.postMessage('ucinewgame');

/**
 * This algorithm will ask Stockfish 11 for the best move.
 * Stockfish 11 has an Elo score of around 3468, but we are "only" running it with a depth of 10.
 * Not recommended to be ran in the background.
 */
export function stockfishMove(chess: Chess, boardAPI: BoardApi | null = null) {
    stockfish.postMessage(`position fen ${chess.fen()}`);
    stockfish.postMessage('go depth 10');

    stockfish.onmessage = (event) => {
        if (event.data.includes('bestmove')) {
            const bestMove = event.data.split(' ')[1];

            makeMove(bestMove, chess, boardAPI);
        }
    };
}
