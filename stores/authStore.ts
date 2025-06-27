import { clearMenuTable } from '@/lib/menuDb';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

export interface Profile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar: string | null; // base64 or uri
  notifications: {
    orderUpdates: boolean;
    promotions: boolean;
    newsletter: boolean;
  };
}

interface AuthState {
  profile: Profile;
  isOnboarded: boolean;
  loadProfile: () => Promise<void>;
  setProfile: (profile: Partial<Profile>) => Promise<void>;
  saveProfile: () => Promise<void>;
  logout: () => Promise<void>;
}

const DEFAULT_PROFILE: Profile = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  avatar: null,
  notifications: {
    orderUpdates: false,
    promotions: false,
    newsletter: false,
  },
};

const PROFILE_KEY = 'userProfile';

export const useAuthStore = create<AuthState>((set, get) => ({
  profile: DEFAULT_PROFILE,
  isOnboarded: false,
  loadProfile: async () => {
    try {
      const stored = await AsyncStorage.getItem(PROFILE_KEY);
      if (stored) {
        set({ profile: JSON.parse(stored), isOnboarded: true });
      } else {
        set({ profile: DEFAULT_PROFILE, isOnboarded: false });
      }
    } catch (e) {
      set({ profile: DEFAULT_PROFILE, isOnboarded: false });
    }
  },
  setProfile: async (profile) => {
    set((state) => ({ profile: { ...state.profile, ...profile } }));
  },
  saveProfile: async () => {
    const { profile } = get();
    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    set({ isOnboarded: true });
  },
  logout: async () => {
    await AsyncStorage.clear();
    await clearMenuTable();
    set({ profile: DEFAULT_PROFILE, isOnboarded: false });
  },
})); 