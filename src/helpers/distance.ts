/**
 * The Chebyshev Distance between two squares.
 */
export function calculateDistance(sq1: string, sq2: string): number {
    const x1 = sq1.charCodeAt(0) - 96;
    const x2 = Number(sq1.charAt(1));

    const y1 = sq2.charCodeAt(0) - 96;
    const y2 = Number(sq2.charAt(1));

    return Math.max(Math.abs(y1 - x1), Math.abs(y2 - x2));
}
