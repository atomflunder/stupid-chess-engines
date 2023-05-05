import type { Chess } from 'chess.js';
import type { BoardApi } from 'vue3-chessboard';

export function makeMove(move: string, chess: Chess, boardAPI: BoardApi | null = null): void {
    if (move !== undefined) {
        if (boardAPI) {
            boardAPI.move(move);
        }
        chess.move(move);
    }
}
