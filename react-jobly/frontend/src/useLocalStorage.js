import { useState } from "react";

function useLocalStorage(key, defaultValue = null) {
  const [storedValue, setStoredValue] = useState(() => {
    const item = window.localStorage.getItem(key);
    if (item === null && defaultValue !== null) {
      window.localStorage.setItem(key, defaultValue);
      return defaultValue;
    }
    return item;
  });

  const setValue = value => {
    setStoredValue(value);
    window.localStorage.setItem(key, value);
  }

  const removeValue = () => {
    setStoredValue(defaultValue);
    if (defaultValue !== null) {
      window.localStorage.setItem(defaultValue);
    } else {
      window.localStorage.removeItem(key);
    }
  }

  return [storedValue, setValue, removeValue];
}

export default useLocalStorage;
