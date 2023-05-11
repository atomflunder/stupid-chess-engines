import { makeMove } from '../move';
import type { AlgorithmVars } from '../algorithms';

/**
 * This algorithm will ask Stockfish 11 for the best move, but without the modern stuff like castling and en passant.
 * No cheating, just like in the good old days of the 16th century.
 */
export function oldschoolfishMove(algorithmVars: AlgorithmVars) {
    const modifiedFen = algorithmVars.chess.fen().split(' ');

    // Disabling castling
    modifiedFen[2] = '-';
    // Disabling en passant
    modifiedFen[3] = '-';

    algorithmVars.stockfishWorker?.postMessage(`position fen ${modifiedFen.join(' ')}`);
    algorithmVars.stockfishWorker?.postMessage(`go depth ${algorithmVars.depth}`);

    makeMove(algorithmVars.bestMove!, algorithmVars.chess, algorithmVars.boardAPI!);
}
