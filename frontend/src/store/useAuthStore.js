import { create } from 'zustand';
import toast from 'react-hot-toast';
import axios from '../lib/axios';

const getErrorMessage = (error) =>
  error?.message || 'Something went wrong. Please try again.';

const useAuthStore = create((set, get) => ({
  user: null,
  isLoading: false,
  isCheckingAuth: true,
  isUpdatingProfile: false,
  signup: async (credentials) => {
    set({ isLoading: true });
    try {
      const { data } = await axios.post('/auth/signup', credentials);
      set({ user: data });
      toast.success('Account created successfully');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      set({ isLoading: false });
    }
  },
  login: async (credentials) => {
    set({ isLoading: true });
    try {
      const { data } = await axios.post('/auth/login', credentials);
      set({ user: data });
      toast.success('Logged in');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      set({ isLoading: false });
    }
  },
  logout: async () => {
    const { user } = get();
    if (!user) return;
    set({ isLoading: true });
    try {
      await axios.post('/auth/logout');
      set({ user: null });
      toast.success('Logged out');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      set({ isLoading: false });
    }
  },
  updateProfile: async (payload) => {
    set({ isUpdatingProfile: true });
    try {
      const { data } = await axios.put('/auth/update-profile', payload);
      set({ user: data });
      toast.success('Profile updated');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const { data } = await axios.get('/auth/check');
      set({ user: data });
    } catch {
      set({ user: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
}));

export default useAuthStore;
