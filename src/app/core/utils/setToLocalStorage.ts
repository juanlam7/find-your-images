export const setToLocalStorage = <T>(data: T, keyName: string): void => {
  const queryString = JSON.stringify(data);
  localStorage.setItem(keyName, queryString);
};