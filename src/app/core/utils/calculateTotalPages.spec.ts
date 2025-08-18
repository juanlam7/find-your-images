import { calculateTotalPages } from './calculateTotalPages';

describe('calculateTotalPages', () => {
  it('should return 0 when totalResults is zero', () => {
    const totalResults = 0;
    const resultsPerPage = 10;
    const result = calculateTotalPages(totalResults, resultsPerPage);
    expect(result).toBe(0);
  });

  it('should return 0 when resultsPerPage is zero', () => {
    const totalResults = 100;
    const resultsPerPage = 0;
    const result = calculateTotalPages(totalResults, resultsPerPage);
    expect(result).toBe(0);
  });

  it('should return 0 when both inputs are negative', () => {
    const totalResults = -100;
    const resultsPerPage = -10;
    const result = calculateTotalPages(totalResults, resultsPerPage);
    expect(result).toBe(0);
  });
});
