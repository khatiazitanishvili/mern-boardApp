
/**
 * Wandelt ein Datum in einen String um.
 */
export function dateToString(date: Date) {
    return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
}