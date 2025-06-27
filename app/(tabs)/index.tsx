import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { createTable, filterMenu, getCategories, insertMenuItems } from '@/lib/menuDb';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Image, ScrollView, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const MENU_URL = 'https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/menu.json';

function getInitials(firstName: string, lastName: string) {
  return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
}

function getImageUrl(imageFileName: string) {
  return `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${imageFileName}?raw=true`;
}

function Banner({ profile, search, setSearch }: any) {
  return (
    <Box className="px-4 py-8 bg-[#495e57] mb-2">
      <View className="flex-row items-center justify-between mb-3">
        <View>
          <Text className="text-3xl font-bold text-white mb-1">Little Lemon</Text>
          <Text className="text-xl text-white mb-1">Chicago</Text>
          <Text className="text-base text-white mb-2" style={{ maxWidth: 220 }}>
            We are a family owned Mediterranean restaurant, focused on traditional recipes served with a modern twist.
          </Text>
        </View>
        <Image source={{ uri: getImageUrl('bruschetta.jpg') }} style={{ width: 80, height: 80, borderRadius: 12 }} />
      </View>
      <Box className="flex-row items-center bg-white rounded-full px-3 py-2">
        <TextInput
          placeholder="Search menu..."
          value={search}
          onChangeText={setSearch}
          className="flex-1 text-base text-black"
          placeholderTextColor="#888"
        />
      </Box>
    </Box>
  );
}

function CategoryList({ categories, selected, onSelect }: any) {
  return (
    <Box className='h-12'>

    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row mb-2 px-2">
      {categories.map((cat: string) => {
        const isActive = selected.includes(cat);
        return (
          <TouchableOpacity
            key={cat}
            onPress={() => onSelect(cat)}
            className={`px-4 py-2 mr-2 rounded-full border ${isActive ? 'bg-primary-500 border-primary-500' : 'bg-black-100 border-black-200'}`}
          >
            <Text className={`text-base font-semibold ${isActive ? 'text-white' : 'text-black-700'}`}>{cat}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
    </Box>
  );
}

export default function HomeScreen() {
  const profile = useAuthStore((state) => state.profile);
  const router = useRouter();
  const [menu, setMenu] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const searchTimeout = useRef<any>(null);

  // Load menu and categories on mount
  const loadMenuAndCategories = useCallback(async () => {
    await createTable();
    let dbMenu = await filterMenu([], '');
    if (dbMenu.length === 0) {
      // Fetch from remote
      try {
        const res = await fetch(MENU_URL);
        const json = await res.json();
        const items = json.menu.map((item: any) => ({ ...item}));
        setMenu(items);
        await insertMenuItems(items);
      } catch (e) {
        // handle error
      } finally {
        setLoading(false);
      }
    } else {
      setMenu(dbMenu);
      setLoading(false);
    }
    const cats = await getCategories();
    setCategories(cats);
  }, []);

  // Filtering logic
  const runFilter = useCallback(async () => {
    setLoading(true);
    const filtered = await filterMenu(selectedCategories, search);
    setMenu(filtered);
    setLoading(false);
  }, [selectedCategories, search]);

  // Debounce search
  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      runFilter();
    }, 500);
    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, [search, selectedCategories, runFilter]);

  useEffect(() => {
    loadMenuAndCategories();
  }, [loadMenuAndCategories]);

  const handleCategorySelect = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const renderItem = ({ item }: { item: any }) => (
    <Box className="flex-row items-center py-4 border-b border-black-200 dark:border-black-700 px-2">
      <View className="flex-1 pr-2">
        <Text className="text-lg font-bold mb-1 text-black">{item.title}</Text>
        <Text className="text-base text-black-600 dark:text-black-300 mb-1" numberOfLines={2}>{item.description}</Text>
        <Text className="text-lg font-bold text-black-700 dark:text-black-200">${item.price}</Text>
      </View>
      <Image
        source={{ uri: item.image }}
        style={{ width: 100, height: 100, borderRadius: 8, backgroundColor: '#eee' }}
        resizeMode="cover"
      />
    </Box>
  );

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-6">
        <Box className='w-12'></Box>
        <Image source={require('@/assets/images/Logo.png')} style={{ width: 140, height: 40, resizeMode: 'contain' }} />
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/profile')}
          className="w-12 h-12 rounded-full bg-gray-300 items-center justify-center overflow-hidden"
        >
          {profile.avatar ? (
            <Image source={{ uri: profile.avatar }} style={{ width: 48, height: 48, borderRadius: 24 }} />
          ) : (
            <Text className="text-2xl font-bold text-black-700 dark:text-black-200">{getInitials(profile.firstName, profile.lastName)}</Text>
          )}
        </TouchableOpacity>
      </View>
      {/* Banner */}
      <Banner profile={profile} search={search} setSearch={setSearch} />
      {/* Categories */}
      <Text className="font-bold text-black text-lg px-4 mb-2 mt-2">ORDER FOR DELIVERY!</Text>
      <CategoryList categories={categories} selected={selectedCategories} onSelect={handleCategorySelect} />
      {/* Menu List */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#22d3ee" />
        </View>
      ) : (
        <FlatList
          data={menu}
          keyExtractor={(item, idx) => item.id ? String(item.id) : `${item.title}-${idx}`}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 24, paddingHorizontal:20 }}
        />
      )}
    </SafeAreaView>
  );
} 