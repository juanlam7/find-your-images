export const loadFromLocalStorage = <T>(key: string): T => {
  const dataFromLocalStorage = localStorage.getItem(key) ?? '{}';
  const data = JSON.parse(dataFromLocalStorage);

  return data as T;
};
