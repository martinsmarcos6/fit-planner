import { AuthGuard } from '@/components/AuthGuard';
import { Tabs } from 'expo-router';
import { Dumbbell, Search, User } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AppLayout() {
  const { bottom } = useSafeAreaInsets();

  return (
    <AuthGuard>
      <Tabs screenOptions={{ 
        headerShown: false,
        tabBarActiveTintColor: '#FF5900',
        tabBarInactiveTintColor: '#6b7280',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
          paddingTop: 8,
          paddingBottom: bottom + 6,
          height: 60 + bottom
        },
        tabBarLabelStyle: {
          fontSize: 12,
          paddingBottom: 8,
        }
      }}>
        <Tabs.Screen 
          name="workouts" 
          options={{
            title: 'Treinos',
            tabBarIcon: ({ color, size }) => <Dumbbell size={size} color={color} />
          }}
        />
        <Tabs.Screen 
          name="create-workout" 
          options={{
            href: null,
          }}
        />
        <Tabs.Screen 
          name="explore" 
          options={{
            title: 'Explorar',
            tabBarIcon: ({ color, size }) => <Search size={size} color={color} />
          }}
        />
        <Tabs.Screen 
          name="profile" 
          options={{
            title: 'Perfil',
            tabBarIcon: ({ color, size }) => <User size={size} color={color} />
          }}
        />
        <Tabs.Screen 
          name="workout-details" 
          options={{
            href: null, // Esconde esta tela da bottom navigation
          }}
        />
        <Tabs.Screen 
          name="day-details" 
          options={{
            href: null, // Esconde esta tela da bottom navigation
          }}
        />
        <Tabs.Screen 
          name="edit-workout" 
          options={{
            href: null, // Esconde esta tela da bottom navigation
          }}
        />
        <Tabs.Screen 
          name="edit-profile" 
          options={{
            href: null, // Esconde esta tela da bottom navigation
          }}
        />
      </Tabs>
    </AuthGuard>
  );
} 