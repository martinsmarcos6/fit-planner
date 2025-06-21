import { AuthGuard } from '@/components/AuthGuard';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Dumbbell, HelpCircle, Search, User } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator();

export default function AppLayout() {
  const insets = useSafeAreaInsets();

  return (
    <AuthGuard>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            if (route.name === 'profile') {
              return <User color={color} size={size} />
            } else if (route.name === 'workouts') {
              return <Dumbbell color={color} size={size} />
            } else if (route.name === 'explore') {
              return <Search color={color} size={size} />
            } else {
              return <HelpCircle color={color} size={size} />
            }
          },
          tabBarActiveTintColor: '#FF5900',
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
          tabBarStyle: {
            backgroundColor: 'white',
            borderTopWidth: 1,
            borderTopColor: '#E5E5E5',
            height: 60 + insets.bottom,
            paddingBottom: 5 + insets.bottom,
            paddingTop: 5,
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
          },
        })}
      >
        <Tab.Screen 
          name="workouts" 
          component={require('./workouts').default}
          options={{ tabBarLabel: 'Treinos' }}
        />
        <Tab.Screen 
          name="explore" 
          component={require('./explore').default}
          options={{ tabBarLabel: 'Explorar' }}
        />
        <Tab.Screen 
          name="profile" 
          component={require('./profile').default}
          options={{ tabBarLabel: 'Perfil' }}
        />
      </Tab.Navigator>
    </AuthGuard>
  );
} 