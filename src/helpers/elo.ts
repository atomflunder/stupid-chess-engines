import { Outcome } from './outcomes';

export function calculateElo(p1: number, p2: number, outcome: Outcome): [number, number] {
    const exp_one = 1 / (1 + Math.pow(10, (p2 - p1) / 400));
    const exp_two = 1 - exp_one;

    let o1 = 0;
    let o2 = 0;

    if (outcome === Outcome.Draw) {
        o1 = 0.5;
        o2 = 0.5;
    } else if (outcome === Outcome.Win) {
        o1 = 1.0;
    } else {
        o2 = 1.0;
    }

    return [32 * (o1 - exp_one) + p1, 32 * (o2 - exp_two) + p2];
}
