import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { 
  loginUser, 
  registerUser, 
  logoutUser, 
  fetchProfile, 
  updateProfile, 
  clearError 
} from '../store/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const login = useCallback(
    async (email, password) => {
      const resultAction = await dispatch(loginUser({ email, password }));
      if (loginUser.fulfilled.match(resultAction)) {
        return resultAction.payload;
      }
      return null;
    },
    [dispatch]
  );
 
  const register = useCallback(
    async (name, email, password, role) => {
      const resultAction = await dispatch(registerUser({ name, email, password, role }));
      if (registerUser.fulfilled.match(resultAction)) {
        return resultAction.payload;
      }
      return null;
    },
    [dispatch]
  );

  const logout = useCallback(async () => {
    await dispatch(logoutUser());
  }, [dispatch]);

  const loadProfile = useCallback(async () => {
    await dispatch(fetchProfile());
  }, [dispatch]);

  const updateProfileDetails = useCallback(
    async (name, email) => {
      const result = await dispatch(updateProfile({ name, email }));
      return result.payload;
    },
    [dispatch]
  );

  const clearAuthErrors = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
    loadProfile,
    updateProfileDetails,
    clearAuthErrors,
  };
};

export default useAuth;
