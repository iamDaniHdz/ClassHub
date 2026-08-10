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
  IconButton,
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
import { AcademiesApi } from '../../academies/services/academies.api';

import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

export const ProfileScreen = ({
  navigation
}: any) => {

  const theme = useAppTheme();
  const { colors } = useTheme() as any;

  const [loading, setLoading] =
    useState(true);

  const [data, setData] =
    useState<any>(null);

  const [academies, setAcademies] =
    useState<any>(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {

      const [
        profile,
        academiesData,
      ] = await Promise.all([
        ProfileApi.getProfile(),
        AcademiesApi.getAll(),
      ]);

      setData(profile);

      setAcademies(
        academiesData,
      );

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
        <View style={{ position: 'relative' }}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1526045478516-99145907023c',
            }}
            style={{height: 180, borderRadius: 20, margin: 16, }}
          />
          <IconButton
            icon="arrow-left"
            mode="contained"
            onPress={() => navigation.goBack()}
            style={{ position: 'absolute', top: 20, left: 20, backgroundColor:colors.white }}
          />
        </View>

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
              backgroundColor: colors.tertiary,
              borderRadius: 20,
              flexDirection: 'row',
              alignSelf: 'baseline',
              gap: 5,
              paddingVertical: 5,
              paddingHorizontal: 10,
            }}
          >
            <Ionicons name={'person'} size={20} color={colors.primary} />
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
              backgroundColor: colors.tertiary,
              borderRadius: 20,
              flexDirection: 'row',
              alignSelf: 'baseline',
              gap: 5,
              paddingVertical: 5,
              paddingHorizontal: 10,
            }}
          >
            <Ionicons name={'school'} size={20} color={colors.primary} />
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
            variant="labelLarge"
            style={{
              marginBottom: 10,
            }}
          >
            Academias asignadas
          </Text>

          {academies.map((academy: any) => (
            <Card
              mode="contained"
              key={academy.assignment_id}
              style={{
                marginBottom: 12,
                backgroundColor: colors.tertiary,
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
                      name="school-outline"
                      size={20}
                      color={colors.primary}
                    />

                    <Text
                      style={{
                        color: colors.primary,
                      }}
                    >
                      {academy.classroom?.name}
                    </Text>
                  </View>

                  <View
                    style={{
                      flex: 1,
                    }}
                  >
                    <Text
                      variant="titleMedium"
                      style={{
                        fontWeight: '600',
                      }}
                    >
                      {academy.academy?.name}
                    </Text>

                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 5,
                      }}
                    >
                      <Ionicons
                        name="person-circle-outline"
                        size={16}
                        color={colors.primary}
                      />

                      <Text
                        style={{
                          color: colors.primary,
                        }}
                      >
                        {academy.students_count} Alumnos
                      </Text>
                    </View>
                  </View>
                </View>
              </Card.Content>
            </Card>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};