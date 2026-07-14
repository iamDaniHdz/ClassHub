import {
  Image,
  ScrollView,
  View,
} from 'react-native';

import {
  ActivityIndicator,
  Card,
  Chip,
  Text,
} from 'react-native-paper';

import {
  useEffect,
  useState,
} from 'react';

import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppTheme } from '../../../theme/useAppTheme';

import { ProfileApi } from '../services/profile.api';

export const ProfileScreen = () => {

  const theme = useAppTheme();

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
        backgroundColor:
          theme.background,
      }}
    >

      <ScrollView>

        {/* COVER */}

        <Image
          source={{
            uri:
              'https://images.unsplash.com/photo-1526045478516-99145907023c',
          }}
          style={{
            width: '100%',
            height: 220,
          }}
        />

        {/* AVATAR */}

        <View
          style={{
            alignItems: 'center',
            marginTop: -60,
          }}
        >

          {data.teacher_profile?.photo ? (

            <Image
              source={{
                uri:
                  data.teacher_profile.photo,
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
                width: 120,
                height: 120,
                borderRadius: 60,

                backgroundColor:
                  theme.primary,

                justifyContent:
                  'center',

                alignItems:
                  'center',

                borderWidth: 4,

                borderColor:
                  'white',
              }}
            >
              <Text
                variant="headlineLarge"
                style={{
                  color: 'white',
                }}
              >
                {
                  data
                    .teacher_profile
                    ?.full_name
                    ?.charAt(0)
                }
              </Text>
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
            {data.teacher_profile?.degree}
            {' '}
            {
              data.teacher_profile
                ?.full_name
            }
          </Text>

          <Text
            style={{
              marginTop: 8,
              color:
                theme.textColor,
              textAlign: 'center',
            }}
          >
            {
              data.teacher_profile
                ?.specialty
              ?? 'Sin especialidad registrada'
            }
          </Text>

        </View>

        {/* TAGS */}

        <View
          style={{
            flexDirection: 'row',
            justifyContent:
              'center',
            marginTop: 16,
            gap: 8,
          }}
        >

          <Chip
            icon="check-circle"
            style={{
              backgroundColor:
                '#D9F5DC',
            }}
          >
            Activo
          </Chip>

          <Chip
            icon="account"
            style={{
              backgroundColor:
                '#FFE4ED',
            }}
          >
            {data.role?.name}
          </Chip>

          <Chip
            icon="school"
            style={{
              backgroundColor:
                '#FFE4ED',
            }}
          >
            {
              data.teacher_profile
                ?.career
            }
          </Chip>

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
              marginBottom: 16,
              fontWeight: 'bold',
            }}
          >
            Academias asignadas
          </Text>

          {
            data.academies.map(
              (academy: any) => (

                <Card
                  key={
                    academy.academy_id
                  }
                  style={{
                    marginBottom: 12,

                    backgroundColor:
                      '#FBE3EA',
                  }}
                >

                  <Card.Content>

                    <View
                      style={{
                        flexDirection:
                          'row',

                        alignItems:
                          'center',
                      }}
                    >

                      <View
                        style={{
                          backgroundColor:
                            '#F7C7D3',

                          borderRadius:
                            14,

                          paddingHorizontal:
                            12,

                          paddingVertical:
                            6,

                          marginRight:
                            12,
                        }}
                      >

                        <Text>
                          👥{' '}
                          {
                            academy.groups_count
                          }{' '}
                          Grupos
                        </Text>

                      </View>

                      <Text
                        variant="titleMedium"
                        style={{
                          flex: 1,
                          fontWeight:
                            '600',
                        }}
                      >
                        {
                          academy.academy_name
                        }
                      </Text>

                    </View>

                  </Card.Content>

                </Card>
              )
            )
          }

        </View>

      </ScrollView>

    </SafeAreaView>
  );
};