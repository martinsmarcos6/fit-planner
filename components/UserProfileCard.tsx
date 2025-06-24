import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Database } from '@/utils/supabase';
import { profileHelpers } from '@/utils/supabase-helpers';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface UserProfileCardProps {
  profile: Profile;
  onPress?: () => void;
  showStats?: boolean;
  compact?: boolean;
}

export const UserProfileCard: React.FC<UserProfileCardProps> = ({
  profile,
  onPress,
  showStats = false,
  compact = false,
}) => {
  const [stats, setStats] = React.useState<{
    totalWorkouts: number;
    publicWorkouts: number;
    totalLikes: number;
    totalSaved: number;
  } | null>(null);

  React.useEffect(() => {
    if (showStats) {
      loadStats();
    }
  }, [profile.id, showStats]);

  const loadStats = async () => {
    const profileStats = await profileHelpers.getProfileStats(profile.id);
    setStats(profileStats);
  };

  const CardContent = () => (
    <Box
      className="bg-white rounded-lg p-4 border border-gray-200"
    >
      <HStack space="md" className="items-center">
        {/* Avatar placeholder */}
        <Box
          className="w-12 h-12 rounded-full bg-blue-500 items-center justify-center"
        >
          <Text
            className="text-white text-lg font-bold"
          >
            {profile.name.charAt(0).toUpperCase()}
          </Text>
        </Box>

        <View className="flex-1">
          <Text
            className="text-lg font-bold text-gray-900"
            numberOfLines={1}
          >
            {profile.name}
          </Text>
          
          <Text
            className="text-sm text-gray-600"
            numberOfLines={1}
          >
            @{profile.username}
          </Text>

          {showStats && stats && (
            <HStack space="lg" className="mt-2">
              <View className="items-center">
                <Text className="text-sm font-bold text-gray-900">
                  {stats.totalWorkouts}
                </Text>
                <Text className="text-xs text-gray-600">
                  Treinos
                </Text>
              </View>
              
              <View className="items-center">
                <Text className="text-sm font-bold text-gray-900">
                  {stats.publicWorkouts}
                </Text>
                <Text className="text-xs text-gray-600">
                  Públicos
                </Text>
              </View>
              
              <View className="items-center">
                <Text className="text-sm font-bold text-gray-900">
                  {stats.totalLikes}
                </Text>
                <Text className="text-xs text-gray-600">
                  Likes
                </Text>
              </View>
            </HStack>
          )}
        </View>
      </HStack>
    </Box>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress}>
        <CardContent />
      </Pressable>
    );
  }

  return <CardContent />;
}; 