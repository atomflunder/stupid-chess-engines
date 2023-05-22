export interface StockfishOptions {
    level: number;
    depth: number;
    maxError: number;
    probability: number;
    fen: string;
}

export function changeStockfishDepth(stockfishOptions: StockfishOptions, depth: number) {
    stockfishOptions.depth = depth;
}

export function changeStockfishLevel(stockfishOptions: StockfishOptions, level: number) {
    stockfishOptions.level = level;
}

export function changeStockfishMaxError(stockfishOptions: StockfishOptions, maxError: number) {
    stockfishOptions.maxError = maxError;
}

export function changeStockfishProbability(
    stockfishOptions: StockfishOptions,
    probability: number
) {
    stockfishOptions.probability = probability;
}
