// loadFromLocalStorage.test.ts
import { loadFromLocalStorage } from "./loadFromLocalStorage";

describe("loadFromLocalStorage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it("should return parsed data when the key exists", () => {
    const key = "user";
    const mockData = { name: "Juan", age: 30 };
    localStorage.setItem(key, JSON.stringify(mockData));

    const result = loadFromLocalStorage<typeof mockData>(key);

    expect(result).toEqual(mockData);
    expect(localStorage.getItem).toHaveBeenCalledWith(key);
  });

  it("should return empty object if key does not exist", () => {
    const key = "nonexistent";
    const result = loadFromLocalStorage<Record<string, unknown>>(key);

    expect(result).toEqual({});
    expect(localStorage.getItem).toHaveBeenCalledWith(key);
  });

  it("should throw an error if stored value is invalid JSON", () => {
    const key = "invalid";
    localStorage.setItem(key, "not-json");

    expect(() => loadFromLocalStorage<any>(key)).toThrow(SyntaxError);
  });
});
