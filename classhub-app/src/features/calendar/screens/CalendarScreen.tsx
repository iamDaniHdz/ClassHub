import React, {
  useCallback,
  useMemo,
  useState,
} from 'react';

import {
  FlatList,
  View,
} from 'react-native';

import {
  ActivityIndicator,
  Card,
  ProgressBar,
  Text,
  useTheme,
} from 'react-native-paper';

import {
  useFocusEffect,
} from '@react-navigation/native';

import Ionicons from 'react-native-vector-icons/Ionicons';

import { ScheduleApi } from '../services/schedule.api';

const DAYS = [
  {
    key: 1,
    label: 'Lun',
  },
  {
    key: 2,
    label: 'Mar',
  },
  {
    key: 3,
    label: 'Mié',
  },
  {
    key: 4,
    label: 'Jue',
  },
  {
    key: 5,
    label: 'Vie',
  },
];

export const CalendarScreen = () => {

  const { colors } =
    useTheme() as any;

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [selectedDay, setSelectedDay] =
    useState(1);

  const [schedule, setSchedule] =
    useState<any[]>([]);

  const load =
  useCallback(async () => {

    try {

      const data =
        await ScheduleApi.getAll();

      setSchedule(data);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);
      setRefreshing(false);
    }

  }, []);

  const onRefresh =
    () => {

      setRefreshing(true);

      load();
    };

  useFocusEffect(
    useCallback(() => {

      load();

    }, [load]),
  );

  const filtered =
    useMemo(() => {

      return schedule
        .filter(
          item =>
            item.day_of_week ===
            selectedDay,
        )
        .sort(
          (a, b) =>
            a.start_time.localeCompare(
              b.start_time,
            ),
        );

    }, [
      schedule,
      selectedDay,
    ]);

  const todayWeekDay =
    useMemo(() => {

      const day =
        new Date().getDay();

      return day === 0
        ? 7
        : day;

    }, []);

  const isTodaySelected =
    selectedDay ===
    todayWeekDay;

  const todayProgress =
    useMemo(() => {

      const now =
        new Date();

      const currentMinutes =
        now.getHours() * 60 +
        now.getMinutes();

      const completedClasses =
        filtered.filter(item => {

          const [
            hour,
            minute,
          ] = item.end_time
            .split(':');

          const endMinutes =
            Number(hour) * 60 +
            Number(minute);

          return (
            endMinutes <=
            currentMinutes
          );
        });

      const progress =
        filtered.length > 0

          ? completedClasses.length /
            filtered.length

          : 0;

      const nextClass =
        filtered.find(item => {

          const [
            hour,
            minute,
          ] = item.start_time
            .split(':');

          const startMinutes =
            Number(hour) * 60 +
            Number(minute);

          return (
            startMinutes >
            currentMinutes
          );
        });

      return {

        completed:
          completedClasses.length,

        total:
          filtered.length,

        progress,

        percentage:
          Math.round(
            progress * 100,
          ),

        nextClass,
      };

    }, [filtered]);

  if (loading) {

    return (
      <ActivityIndicator
        style={{
          marginTop: 40,
        }}
      />
    );
  }

  return (

    <FlatList

      data={filtered}
      refreshing={refreshing}
      onRefresh={onRefresh}
      keyExtractor={item =>
        item.schedule_id.toString()
      }

      contentContainerStyle={{
        padding: 16,
        backgroundColor:
          colors.background,
        flexGrow: 1,
      }}

      ListHeaderComponent={

        <View>

          <Text
            variant="headlineSmall"
            style={{
              color:
                colors.titleColor,
              marginBottom: 4,
              fontWeight: 'bold',
            }}
          >
            Mis horarios
          </Text>

          <Text
            variant="bodyLarge"
            style={{
              color:
                colors.textColor,
              marginBottom: 20,
            }}
          >
            Organiza tus clases
          </Text>

          <FlatList

            horizontal

            data={DAYS}

            keyExtractor={item =>
              item.key.toString()
            }

            showsHorizontalScrollIndicator={
              false
            }

            renderItem={({
              item,
            }) => (

              <Card

                mode="contained"

                onPress={() =>
                  setSelectedDay(
                    item.key,
                  )
                }

                style={{
                  marginRight: 10,

                  backgroundColor:
                    selectedDay ===
                    item.key

                      ? colors.primary

                      : colors.cardBackground,
                }}
              >

                <Card.Content>

                  <Text
                    style={{
                      color:

                        selectedDay ===
                        item.key

                          ? '#FFF'

                          : colors.textColor,
                    }}
                  >
                    {item.label}
                  </Text>

                </Card.Content>

              </Card>

            )}
          />

          <Card
            mode="contained"
            style={{
              marginTop: 20,
              marginBottom: 20,
              backgroundColor:
                colors.cardBackground,
            }}
          >

            <Card.Content>

              {isTodaySelected ? (

                <>

                  <View
                    style={{
                      flexDirection:
                        'row',

                      justifyContent:
                        'space-between',

                      alignItems:
                        'center',
                    }}
                  >

                    <Text
                      variant="titleMedium"
                      style={{
                        fontWeight:
                          '700',
                      }}
                    >
                      Clases de hoy
                    </Text>

                    <Text>

                      {
                        todayProgress.completed
                      }

                      /

                      {
                        todayProgress.total
                      }

                    </Text>

                  </View>

                  <Text
                    style={{
                      marginTop: 8,
                    }}
                  >
                    Progreso
                  </Text>

                  <ProgressBar

                    progress={
                      todayProgress.progress
                    }

                    color={
                      colors.primary
                    }

                    style={{
                      marginTop: 10,
                      height: 10,
                      borderRadius: 5,
                    }}
                  />

                  <Text
                    style={{
                      marginTop: 8,
                      textAlign:
                        'right',
                    }}
                  >
                    {
                      todayProgress.percentage
                    }
                    %
                  </Text>

                  {todayProgress.nextClass && (

                    <View
                      style={{
                        marginTop: 12,
                      }}
                    >

                      <Text
                        variant="labelMedium"
                      >
                        Siguiente clase
                      </Text>

                      <Text
                        variant="bodyLarge"
                      >
                        {
                          todayProgress
                            .nextClass
                            .academy?.name
                        }
                      </Text>

                      <Text>
                        {
                          todayProgress
                            .nextClass
                            .classroom?.name
                        }

                        {' · '}

                        {
                          todayProgress
                            .nextClass
                            .start_time
                            ?.substring(
                              0,
                              5,
                            )
                        }

                        {' - '}

                        {
                          todayProgress
                            .nextClass
                            .end_time
                            ?.substring(
                              0,
                              5,
                            )
                        }
                      </Text>

                    </View>

                  )}

                </>

              ) : (

                <>

                  <Text
                    variant="titleMedium"
                    style={{
                      fontWeight:
                        '700',
                    }}
                  >
                    Clases programadas
                  </Text>

                  <Text
                    variant="displaySmall"
                    style={{
                      marginTop: 8,
                    }}
                  >
                    {filtered.length}
                  </Text>

                  <Text
                    style={{
                      marginTop: 4,
                    }}
                  >
                    {
                      filtered.length === 1

                        ? 'Clase programada'

                        : 'Clases programadas'
                    }
                  </Text>

                </>

              )}

            </Card.Content>

          </Card>

          <Text
            variant="titleLarge"
            style={{
              marginBottom: 12,
            }}
          >
            Cronograma
          </Text>

        </View>

      }

      renderItem={({ item }) => (

        <Card
          mode="contained"
          style={{
            marginBottom: 12,
            backgroundColor:
              colors.cardBackground,
          }}
        >

          <Card.Content>

            <Text variant="titleMedium">
              {item.academy?.name}
            </Text>

            <Text
              style={{
                marginTop: 4,
              }}
            >
              {item.classroom?.name}
            </Text>

            <View
              style={{
                flexDirection:
                  'row',

                marginTop: 8,

                alignItems:
                  'center',
              }}
            >

              <Ionicons
                name="time-outline"
                size={18}
                color={
                  colors.primary
                }
              />

              <Text
                style={{
                  marginLeft: 6,
                }}
              >
                {
                  item.start_time
                    ?.substring(
                      0,
                      5,
                    )
                }

                {' - '}

                {
                  item.end_time
                    ?.substring(
                      0,
                      5,
                    )
                }
              </Text>

            </View>

          </Card.Content>

        </Card>

      )}

      ListEmptyComponent={

        <View
          style={{
            alignItems:
              'center',

            marginTop: 50,
          }}
        >

          <Ionicons
            name="calendar-outline"
            size={64}
            color={
              colors.outline
            }
          />

          <Text
            style={{
              marginTop: 12,
            }}
          >
            No tienes clases este día
          </Text>

        </View>

      }

    />

  );
};