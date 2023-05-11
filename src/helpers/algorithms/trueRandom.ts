import { allAlgorithms, type AlgorithmVars } from '../algorithms';

/**
 * This algorithm will pick a random algorithm to make its move.
 */
export function trueRandomMove(algorithmVars: AlgorithmVars) {
    const algorithmArray = Object.keys(allAlgorithms);
    const index = Math.floor(Math.random() * algorithmArray.length);

    const randomKey = algorithmArray[index];

    // @ts-ignore
    allAlgorithms[randomKey].algorithm(algorithmVars);
}
