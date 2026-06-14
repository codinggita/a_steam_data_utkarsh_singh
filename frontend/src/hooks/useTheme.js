import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect } from 'react';
import { toggleDarkMode } from '../store/uiSlice';

export const useTheme = () => {
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.ui.darkMode);

  const toggle = useCallback(() => {
    dispatch(toggleDarkMode());
  }, [dispatch]);

  // Synchronize CSS class list on mount
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return {
    darkMode,
    toggle,
  };
};

export default useTheme;
