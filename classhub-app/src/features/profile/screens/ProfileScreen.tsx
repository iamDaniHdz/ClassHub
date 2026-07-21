import {
  Image,
  ScrollView,
  View,
} from 'react-native';

import {
  ActivityIndicator,
  Avatar,
  Card,
  Chip,
  Text,
  useTheme,
} from 'react-native-paper';

import {
  useEffect,
  useState,
} from 'react';

import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppTheme } from '../../../theme/useAppTheme';

import { ProfileApi } from '../services/profile.api';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

export const ProfileScreen = () => {

  const theme = useAppTheme();
  const { colors } = useTheme() as any;

  const [loading, setLoading] =
    useState(true);

  const [data, setData] =
    useState<any>(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {

    try {

      const result =
        await ProfileApi.getProfile();

      setData(result);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }
  };

  if (loading) {
    return (
      <ActivityIndicator
        style={{
          marginTop: 50,
        }}
      />
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.background,
      }}
    >
      <ScrollView>
        {/* COVER */}

        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1526045478516-99145907023c',
          }}
          style={{
            height: 180,
            marginHorizontal: 15,
            marginTop: 10,
            borderRadius: 20,
          }}
        />

        {/* AVATAR */}

        <View>
          {data.teacher_profile?.photo ? (
            <Image
              source={{
                uri: data.teacher_profile.photo,
              }}
              style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                borderWidth: 4,
                borderColor: 'white',
              }}
            />
          ) : (
            <View
              style={{
                alignItems: 'center',
                marginTop: -55,
              }}
            >
              <Avatar.Text
                size={110}
                label={
                  data.teacher_profile?.full_name?.charAt(0)?.toUpperCase() ??
                  '?'
                }
              />
            </View>
          )}
        </View>

        {/* INFO */}

        <View
          style={{
            alignItems: 'center',
            paddingHorizontal: 20,
            marginTop: 16,
          }}
        >
          <Text
            variant="headlineSmall"
            style={{
              textAlign: 'center',
              fontWeight: 'bold',
            }}
          >
            {data.teacher_profile?.degree}.{' '}
            {data.teacher_profile?.full_name.replace(/\s+/g, ' ').trim()}
          </Text>

          <Text
            style={{
              marginTop: 8,
              color: theme.textColor,
              textAlign: 'center',
            }}
          >
            {data.teacher_profile?.specialty ?? 'Sin especialidad registrada'}
          </Text>
        </View>

        {/* TAGS */}

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 16,
            gap: 8,
          }}
        >
          <View
            style={{
              backgroundColor: colors.textSuccessBackground,
              borderRadius: 20,
              flexDirection: 'row',
              alignSelf: 'baseline',
              gap: 5,
              paddingVertical: 5,
              paddingHorizontal: 10,
            }}
          >
            <Ionicons
              name={'checkmark-circle'}
              size={20}
              color={colors.textSuccess}
            />
            <Text variant="bodyMedium" style={{ color: colors.textSuccess }}>
              Activo
            </Text>
          </View>

          <View
            style={{
              backgroundColor: colors.terciary,
              borderRadius: 20,
              flexDirection: 'row',
              alignSelf: 'baseline',
              gap: 5,
              paddingVertical: 5,
              paddingHorizontal: 10,
            }}
          >
            <Ionicons
              name={'person'}
              size={20}
              color={colors.primary}
            />
            <Text variant="bodyMedium" style={{ color: colors.primary }}>
              {data.role?.name}
            </Text>
          </View>
        </View>
        <View
          style={{
            alignSelf: 'center',
            marginTop: 10,
          }}
        >
          <View
            style={{
              backgroundColor: colors.terciary,
              borderRadius: 20,
              flexDirection: 'row',
              alignSelf: 'baseline',
              gap: 5,
              paddingVertical: 5,
              paddingHorizontal: 10,
            }}
          >
            <Ionicons
              name={'school'}
              size={20}
              color={colors.primary}
            />
            <Text variant="bodyMedium" style={{ color: colors.primary }}>
              {data.teacher_profile?.career}
            </Text>
          </View>
        </View>

        {/* ACADEMIAS */}

        <View
          style={{
            padding: 20,
          }}
        >
          <Text
            variant="titleLarge"
            style={{
              marginBottom: 10,
              fontWeight: 'bold'
            }}
          >
            Academias asignadas
          </Text>

          {data.academies.map((academy: any) => (
            <Card
              mode='contained'
              key={academy.academy_id}
              style={{
                marginBottom: 12,
                backgroundColor: colors.terciary,
              }}
            >
              <Card.Content>
                <View
                  style={{
                    flexDirection: 'row',

                    alignItems: 'center',
                  }}
                >
                  <View
                    style={{
                      backgroundColor: '#F7C7D3',
                      flexDirection: 'row',
                      borderRadius: 14,
                      gap: 5,
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      marginRight: 12,
                    }}
                  >
                    <Ionicons
                      name={'people'}
                      size={20}
                      color={colors.primary}
                    />
                    <Text style={{color:colors.primary}}>{academy.groups_count} Grupos</Text>
                  </View>

                  <Text
                    variant="titleMedium"
                    style={{
                      flex: 1,
                      fontWeight: '600',
                    }}
                  >
                    {academy.academy_name}
                  </Text>
                </View>
              </Card.Content>
            </Card>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};