// Function to get numeric values of an enum as an ordered array
export function getEnumValues<T>(enumObj: T): number[] {
  return Object.values(enumObj)
    .filter((value) => typeof value === 'number') // Filter out non-numeric values
    .sort((a, b) => a - b) as number[] // Sort numerically
}
