import { Box } from '@/components/ui/box';
import { Button } from '@/components/ui/button';
import { Input, InputField } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { useAuthStore } from '@/stores/authStore';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Image, View } from 'react-native';

export default function OnboardingScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const setProfile = useAuthStore((state) => state.setProfile);
  const saveProfile = useAuthStore((state) => state.saveProfile);

  const handlePress = async () => {
    if (firstName.trim() && lastName.trim() && email.trim()) {
      await setProfile({ firstName, lastName, email });
      await saveProfile();
      router.replace('/(tabs)')
    } else {
      alert('Please enter your first name, last name, and email.');
    }
  };
  function getImageUrl(imageFileName: string) {
    return `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${imageFileName}?raw=true`;
  }
  function Banner() {
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
      </Box>
    );
  }

  return (
    <Box className="flex-1 justify-center px-6 bg-white dark:bg-black">
      <View className="flex-row items-center justify-between px-4 py-6">
        <Box className='w-12'></Box>
        <Image source={require('@/assets/images/Logo.png')} style={{ width: 200, height: 40, resizeMode: 'contain' }} />
        <Box className='w-12'></Box>
      </View>
      {/* Banner */}
      <Banner/>
      <Text className="text-3xl font-bold text-center mb-2 text-black dark:text-white">Welcome!</Text>
      <Text className="text-lg text-center mb-6 text-gray-600 dark:text-gray-300">Let's get you set up.</Text>
      <View className="mb-4">
        <Text className="mb-1 text-black dark:text-white font-medium">First Name</Text>
        <Input className="h-16">
          <InputField
            placeholder="First Name"
            value={firstName}
            onChangeText={setFirstName}
          />
        </Input>
      </View>
      <View className="mb-4">
        <Text className="mb-1 text-black dark:text-white font-medium">Last Name</Text>
        <Input className="h-16">
          <InputField
            placeholder="Last Name"
            value={lastName}
            onChangeText={setLastName}
          />
        </Input>
      </View>
      <View className="mb-6">
        <Text className="mb-1 text-black dark:text-white font-medium">Email</Text>
        <Input className="h-16">
          <InputField
            placeholder="Your Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </Input>
      </View>
      <Button className="bg-[#495e57] h-16" onPress={handlePress}>
        <Text className="text-white font-bold">Continue</Text>
      </Button>
    </Box>
  );
} 