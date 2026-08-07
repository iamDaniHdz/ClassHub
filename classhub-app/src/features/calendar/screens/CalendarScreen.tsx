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
  Button,
  Card,
  Divider,
  ProgressBar,
  Text,
  useTheme,
} from 'react-native-paper';

import {
  useFocusEffect,
} from '@react-navigation/native';

import Ionicons from 'react-native-vector-icons/Ionicons';

import { ScheduleApi } from '../services/schedule.api';

import moment from 'moment';
import 'moment/locale/es';

moment.locale('es');

export const CalendarScreen = () => {

  const { colors } =
    useTheme() as any;

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const getCurrentWeekDays = () => {

    const today =
      new Date();

    const currentDay =
      today.getDay();

    const monday =
      new Date(today);

    const diff =
      currentDay === 0
        ? -6
        : 1 - currentDay;

    monday.setDate(
      today.getDate() + diff,
    );

    return Array.from(
      { length: 5 },
      (_, index) => {

        const date =
          new Date(monday);

        date.setDate(
          monday.getDate() + index,
        );

        const labels = [
          'Dom',
          'Lun',
          'Mar',
          'Mié',
          'Jue',
          'Vie',
          'Sáb',
        ];

        return {
          key: index + 1,
          label:
            labels[
              date.getDay()
            ],
          day:
            date.getDate(),
          fullDate:
            date,
        };
      },
    );
  };

  const DAYS = getCurrentWeekDays();

  const getCurrentWeekDay =
    () => {

      const day =
        new Date().getDay();

      return day === 0
        ? 7
        : day;
    };

  const [selectedDay, setSelectedDay] =
    useState(
      getCurrentWeekDay(),
    );

  const todayDisplay =
    useMemo(() => {

      return moment().format(
        'DD MMMM YYYY, dddd',
      );

    }, []);

  const selectedDateDisplay =
    useMemo(() => {

      const selectedDate =
        DAYS.find(
          day => day.key === selectedDay,
        );

      if (!selectedDate) {
        return todayDisplay;
      }

      return moment(
        selectedDate.fullDate,
      ).format(
        'DD MMMM YYYY, dddd',
      );

    }, [
      todayDisplay,
      DAYS,
      selectedDay,
  ]);

  const selectedDateDisplayShort =
    useMemo(() => {

      const selectedDate =
        DAYS.find(
          day => day.key === selectedDay,
        );

      if (!selectedDate) {
        return todayDisplay;
      }

      return moment(
        selectedDate.fullDate,
      ).format(
        'DD MMM YYYY',
      );

    }, [
      todayDisplay,
      DAYS,
      selectedDay,
  ]);

  const todayWeekDay =
    useMemo(
      () => getCurrentWeekDay(),
      [],
    );
  
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
      keyExtractor={item => item.schedule_id.toString()}
      contentContainerStyle={{
        padding: 16,
        backgroundColor: colors.background,
        flexGrow: 1,
      }}
      ListHeaderComponent={
        <View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: 20,
            }}
          >

            <View>

              <Text
                variant="headlineSmall"
                style={{
                  color: colors.titleColor,
                  marginBottom: 4,
                  fontWeight: 'bold',
                }}
              >
                Mis horarios
              </Text>

              <Text
                variant="bodyLarge"
                style={{
                  color: colors.textColor,
                }}
              >
                Organiza tus clases
              </Text>

            </View>

            <Button icon="calendar" mode="contained" 
              onPress={() =>
                setSelectedDay(
                  getCurrentWeekDay(),
                )
              }>
              Hoy
            </Button>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              gap: 8,
            }}
          >
            {DAYS.map(item => (
              <Card
                key={item.key}
                mode="contained"
                onPress={() => setSelectedDay(item.key)}
                style={{
                  flex: 1,

                  height: 65,

                  justifyContent: 'center',

                  backgroundColor:
                    selectedDay === item.key
                      ? colors.primary
                      : colors.cardBackground,
                }}
              >
                <Card.Content
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text
                    style={{
                      color:
                        selectedDay === item.key ? '#FFF' : colors.textColor,
                      fontWeight: '700',
                    }}
                  >
                    {item.label}
                  </Text>

                  <Text
                    style={{
                      color:
                        selectedDay === item.key ? '#FFF' : colors.textColor,
                      fontSize: 18,
                      marginTop: 4,
                    }}
                  >
                    {item.day}
                  </Text>
                </Card.Content>
              </Card>
            ))}
          </View>

       
          <Card
            mode="contained"
            style={{
              marginTop: 20,
              marginBottom: 20,
              backgroundColor: colors.cardBackground,
            }}
          >
            <Card.Content>
              {isTodaySelected && todayProgress.total>0 ? (
                <>
                  <View
                    style={{
                      flexDirection: 'row',

                      justifyContent: 'space-between',

                      alignItems: 'center',
                    }}
                  >
                    <Text
                      variant="titleMedium"
                      style={{
                        fontWeight: '700',
                      }}
                    >
                      Clases de hoy
                    </Text>
                    <Text 
                        variant='labelLarge'
                        style={{
                          color: colors.gray
                        }}
                      >
                        {selectedDateDisplayShort}
                      </Text>
                  </View>

                  <Text
                    variant="labelMedium"
                    style={{
                      marginTop: 8,
                    }}
                  >
                    Progreso
                  </Text>

                  <ProgressBar
                    progress={todayProgress.progress}
                    color={colors.primary}
                    style={{
                      marginTop: 10,
                      height: 10,
                      borderRadius: 5,
                    }}
                  />

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginTop: 8,
                    }}
                  >
                    <Text variant="labelMedium">
                      {todayProgress.completed}/{todayProgress.total} Clases
                      completadas
                    </Text>

                    <Text
                      variant="labelMedium"
                      style={{
                        color: colors.primary,
                      }}
                    >
                      {todayProgress.percentage}%
                    </Text>
                  </View>

                  {todayProgress.nextClass && (
                    <View
                      style={{
                        marginTop: 12,
                      }}
                    >
                      <Divider
                        style={{
                          backgroundColor: colors.gray,
                          marginBottom: 10,
                        }}
                      />

                      <Text variant="labelMedium">Siguiente clase</Text>

                      <Card
                        mode="contained"
                        style={{
                          marginTop: 10,
                          backgroundColor: colors.background,
                          flexDirection: 'row',
                        }}
                      >
                        <Card.Content
                          style={{
                            flexDirection: 'row',
                            margin: -16,
                          }}
                        >
                          <View
                            style={{
                              width: '20%',
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderEndColor: colors.gray,
                              borderEndWidth: 0.5,
                              paddingVertical: 10,
                            }}
                          >
                            <Text
                              variant="labelLarge"
                              style={{
                                paddingVertical: 8,
                                paddingHorizontal: 16,
                                borderRadius: 20,
                              }}
                            >
                              {todayProgress.nextClass.classroom?.name}
                            </Text>
                          </View>

                          <View
                            style={{
                              width: '80%',
                              padding: 10,
                              paddingStart: 20,
                            }}
                          >
                            <Text
                              variant="bodyLarge"
                              style={{
                                color: colors.titleColor,
                              }}
                            >
                              {todayProgress.nextClass.academy?.name}
                            </Text>

                            <View
                              style={{
                                flexDirection: 'row',
                                marginTop: 8,
                                alignItems: 'center',
                              }}
                            >
                              <Ionicons
                                name="time-outline"
                                size={18}
                                color={colors.gray}
                              />

                              <Text
                                style={{
                                  marginLeft: 6,
                                  color: colors.gray,
                                }}
                              >
                                {todayProgress.nextClass.start_time?.substring(
                                  0,
                                  5,
                                )}

                                {' - '}

                                {todayProgress.nextClass.end_time?.substring(
                                  0,
                                  5,
                                )}
                              </Text>
                            </View>
                          </View>
                        </Card.Content>
                      </Card>
                    </View>
                  )}
                </>
              ) : (
                <>
                  <View style={{
                    flexDirection: 'row',
                    gap: 15,
                  }}>
                    <Text
                      variant="displaySmall"
                      style={{
                        padding: 10,
                        backgroundColor: colors.terciary,
                        borderRadius: 10,
                        color: colors.primary,
                        width: 65,
                        height: 65,
                        textAlign: 'center',
                      }}
                    >
                      {filtered.length}
                    </Text>
                    <View>
                      <Text
                        variant="titleMedium"
                        style={{
                          color: colors.titleColor
                        }}
                      >
                        Clases programadas
                      </Text>
                      <Text 
                        variant='labelLarge'
                        style={{
                          color: colors.gray
                        }}
                      >
                        {selectedDateDisplay}
                      </Text>
                    </View>
                  </View>
                </>
              )}
            </Card.Content>
          </Card>

          <Text
            variant="labelLarge"
            style={{
              marginBottom: 10,
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
            backgroundColor: colors.cardBackground,
            flexDirection: 'row',
          }}
        >
          <Card.Content
            style={{
              flexDirection: 'row',
              margin: -16,
            }}
          >
            <View
              style={{
                width: '20%',
                alignItems: 'center',
                justifyContent: 'center',
                borderEndColor: colors.gray,
                borderEndWidth: 0.5,
                paddingVertical: 10,
              }}
            >
              <Text
                variant="labelLarge"
                style={{
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                  borderRadius: 20,
                }}
              >
                {item.classroom?.name}
              </Text>
            </View>

            <View
              style={{
                width: '80%',
                padding: 10,
                paddingStart: 20,
              }}
            >
              <Text
                variant="bodyLarge"
                style={{
                  color: colors.titleColor,
                }}
              >
                {item.academy?.name}
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 8,
                  alignItems: 'center',
                }}
              >
                <Ionicons name="time-outline" size={18} color={colors.gray} />

                <Text
                  style={{
                    marginLeft: 6,
                    color: colors.gray,
                  }}
                >
                  {item.start_time?.substring(0, 5)}

                  {' - '}

                  {item.end_time?.substring(0, 5)}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      )}
      ListEmptyComponent={
        <View
          style={{
            alignItems: 'center',

            marginTop: 50,
          }}
        >
          <Ionicons name="calendar-outline" size={64} color={colors.outline} />

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