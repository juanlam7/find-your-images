export function calculateTotalPages(
  totalResults: number,
  resultsPerPage: number
): number {
  if (totalResults <= 0 || resultsPerPage <= 0) {
    return 0;
  }
  return Math.ceil(totalResults / resultsPerPage);
}
