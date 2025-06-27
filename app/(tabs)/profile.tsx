import { Box } from '@/components/ui/box';
import { Button } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import { Input, InputField } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { Profile, useAuthStore } from '@/stores/authStore';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, TouchableOpacity, View } from 'react-native';
import { MaskedTextInput } from 'react-native-mask-text';
import { SafeAreaView } from 'react-native-safe-area-context';

const notificationOptions: { key: keyof Profile['notifications']; label: string }[] = [
  { key: 'orderUpdates', label: 'Order Updates' },
  { key: 'promotions', label: 'Promotions' },
  { key: 'newsletter', label: 'Newsletter' },
];

function getInitials(firstName: string, lastName: string) {
  return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
}

function isValidUSPhone(phone: string) {
  // Just check for 10 digits
  return phone.replace(/\D/g, '').length === 10;
}

export default function ProfileScreen() {
  const profile = useAuthStore((state) => state.profile);
  const setProfile = useAuthStore((state) => state.setProfile);
  const saveProfile = useAuthStore((state) => state.saveProfile);
  const logout = useAuthStore((state) => state.logout);

  const [firstName, setFirstName] = useState(profile.firstName);
  const [lastName, setLastName] = useState(profile.lastName);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);
  const [avatar, setAvatar] = useState<string | null>(profile.avatar);
  const [notifications, setNotifications] = useState(profile.notifications);
  const [phoneError, setPhoneError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setFirstName(profile.firstName);
    setLastName(profile.lastName);
    setEmail(profile.email);
    setPhone(profile.phone);
    setAvatar(profile.avatar);
    setNotifications(profile.notifications);
  }, [profile]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });
    if (!result.canceled && result.assets && result.assets[0]) {
      setAvatar(result.assets[0].base64 ? `data:image/jpeg;base64,${result.assets[0].base64}` : result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!isValidUSPhone(phone)) {
      setPhoneError('Please enter a valid US phone number.');
      return;
    }
    setPhoneError('');
    setSaving(true);
    await setProfile({ firstName, lastName, email, phone, avatar, notifications });
    await saveProfile();
    setSaving(false);
  };

  const handleCheckbox = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleDiscard = () => {
    setFirstName(profile.firstName);
    setLastName(profile.lastName);
    setEmail(profile.email);
    setPhone(profile.phone);
    setAvatar(profile.avatar);
    setNotifications(profile.notifications);
    setPhoneError('');
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 px-6 bg-white dark:bg-black">
      <View className="flex-row items-center justify-between py-6">
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
      <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
        <Box className='flex-1 py-4'>


          <View className="items-center mb-6">
            <TouchableOpacity onPress={pickImage} className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 items-center justify-center overflow-hidden mb-2">
              {avatar ? (
                <Image source={{ uri: avatar }} style={{ width: 96, height: 96, borderRadius: 48 }} />
              ) : (
                <Text className="text-4xl font-bold text-gray-700 dark:text-gray-200">{getInitials(firstName, lastName)}</Text>
              )}
            </TouchableOpacity>
            <Text className="text-base text-gray-500 dark:text-gray-400">Tap to change photo</Text>
          </View>
          <View className="mb-4">
            <Text className="mb-1 text-black dark:text-white font-medium">First Name</Text>
            <Input className='h-16'>
              <InputField
                placeholder="First Name"
                value={firstName}
                onChangeText={setFirstName}
              />
            </Input>
          </View>
          <View className="mb-4">
            <Text className="mb-1 text-black dark:text-white font-medium">Last Name</Text>
            <Input className='h-16'>
              <InputField
                placeholder="Last Name"
                value={lastName}
                onChangeText={setLastName}
              />
            </Input>
          </View>
          <View className="mb-4">
            <Text className="mb-1 text-black dark:text-white font-medium">Email</Text>
            <Input className='h-16'>
              <InputField
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </Input>
          </View>
          <View className="mb-2 h-min">
            <Text className="mb-1 text-black dark:text-white font-medium">Phone Number</Text>
            <Input className='h-min pl-3'>
              <MaskedTextInput
                mask="(999) 999-9999"
                placeholder="Phone Number"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                style={{ fontSize: 16, color: 'white', backgroundColor: 'transparent', }}
              />
            </Input>
          </View>
          {phoneError ? <Text className="text-red-500 mb-2">{phoneError}</Text> : null}
          <Box className="mb-6">
            <Text className="text-lg font-semibold mb-2 text-black dark:text-white">Email Notifications</Text>
            {notificationOptions.map((opt) => (
              <TouchableOpacity
                key={opt.key}
                className="flex-row items-center mb-2"
                onPress={() => handleCheckbox(opt.key)}
                activeOpacity={0.7}
              >
                <View className={`w-5 h-5 rounded border-2 mr-3 ${notifications[opt.key] ? 'bg-[#495e57] border-[#495e57]' : 'border-gray-400 bg-white dark:bg-black'}`} />
                <Text className="text-base text-black dark:text-white">{opt.label}</Text>
              </TouchableOpacity>
            ))}
          </Box>
          <Button
            className="mb-4 bg-[#f4ce14] p-4 rounded-lg h-16"
            onPress={async () => {
              await logout();
              router.replace('/onboarding');
            }}
          >
            <Text className="text-black font-bold">Logout</Text>
          </Button>
          <HStack className="flex-row gap-4">
            <Button
              className="flex-1 bg-[#495e57] p-4 rounded-lg h-16"
              onPress={handleSave}
              disabled={saving}
            >
              <Text className="text-white font-bold">{saving ? 'Saving...' : 'Save Changes'}</Text>
            </Button>
            <Button
              className="flex-1 bg-gray-300 p-4 rounded-lg h-16"
              onPress={handleDiscard}
              disabled={saving}
            >
              <Text className="text-black font-bold">Discard Changes</Text>
            </Button>
          </HStack>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
} 