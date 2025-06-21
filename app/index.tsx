import { useAuthContext } from '@/contexts/AuthContext';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function IndexPage() {
  const { isAuthenticated, isLoading } = useAuthContext();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.replace('/(app)/profile');
      } else {
        router.replace('/login');
      }
    }
  }, [isAuthenticated, isLoading]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
} 