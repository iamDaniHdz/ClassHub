import React, {
  useCallback,
  useState,
} from 'react';

import {
  RefreshControl,
  ScrollView,
  View,
} from 'react-native';

import {
  ActivityIndicator,
  Avatar,
  Card,
  Button,
  Text,
  useTheme,
} from 'react-native-paper';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import {
  useFocusEffect,
} from '@react-navigation/native';

import Ionicons from 'react-native-vector-icons/Ionicons';

import { DashboardApi } from '../services/dashboard.api';

import { useAuthStore } from '../../auth/store/auth.store';

export const DashboardScreen = ({
  navigation,
}: any) => {

  const { user } =
    useAuthStore();

  const { colors } =
    useTheme() as any;

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [dashboard, setDashboard] =
    useState<any>(null);

  const load =
    useCallback(async () => {

      try {

        const data =
          await DashboardApi.getOverview();

        setDashboard(data);

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);
        setRefreshing(false);
      }

    }, []);

  useFocusEffect(
    useCallback(() => {

      load();

    }, [load]),
  );

  const onRefresh =
    () => {

      setRefreshing(true);

      load();
    };

  const getDayName =
    (day: number) => {

      const days: Record<
        number,
        string
      > = {

        1: 'Lunes',
        2: 'Martes',
        3: 'Miércoles',
        4: 'Jueves',
        5: 'Viernes',
        6: 'Sábado',
        7: 'Domingo',
      };

      return days[day] ?? '';
    };

  const classInfo =
    dashboard?.current_class
      ?? dashboard?.next_class;

  const isCurrentClass =
    !!dashboard?.current_class;

  const visiblePendings =
    dashboard?.upcoming_pendings
      ?.slice(0, 3) ?? [];

  const remainingPendings =
    Math.max(
      (
        dashboard?.upcoming_pendings
          ?.length ?? 0
      ) - 3,
      0,
    );

  const MetricCard = ({
    label,
    value,
    icon,
    iconColor,
    backgroundColor,
  }: any) => (

    <Card
      mode="contained"
      style={{
        flex: 1,
        backgroundColor:
          colors.cardBackground,
      }}
    >

      <Card.Content>

        <View
          style={{
            alignSelf: 'center',
            backgroundColor,
            borderRadius: 12,
            padding: 10,
            marginBottom: 8,
          }}
        >

          <Ionicons
            name={icon}
            size={24}
            color={iconColor}
          />

        </View>

        <Text
          variant="headlineMedium"
          style={{
            textAlign: 'center',
          }}
        >
          {value}
        </Text>

        <Text
          style={{
            textAlign: 'center',
            color:
              colors.textColor,
          }}
        >
          {label}
        </Text>

      </Card.Content>

    </Card>
  );

  if (loading) {

    return (

      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor:
            colors.background,
        }}
      >

        <ActivityIndicator
          style={{
            marginTop: 50,
          }}
        />

      </SafeAreaView>

    );
  }

  return (

    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor:
          colors.background,
      }}
    >

      <ScrollView

        refreshControl={

          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />

        }

        contentContainerStyle={{
          padding: 20,
        }}
      >

        {/* HEADER */}

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            marginBottom: 24,
          }}
        >

          <Avatar.Text
            size={48}
            label={
              user?.name
                ?.charAt(0)
                ?.toUpperCase() ??
              '?'
            }
          />

          <View>

            <Text
              variant="bodyMedium"
              style={{
                color:
                  colors.textColor,
              }}
            >
              Hola {user?.role?.name}
            </Text>

            <Text
              variant="headlineSmall"
              style={{
                fontWeight: '700',
                color:
                  colors.titleColor,
              }}
            >
              {user?.name}
            </Text>

          </View>

        </View>

        {/* KPIS */}

        <View
          style={{
            flexDirection: 'row',
            gap: 10,
            marginBottom: 10,
          }}
        >

          <MetricCard
            label="Academias"
            value={
              dashboard?.metrics
                ?.academies ?? 0
            }
            icon="school-outline"
            iconColor={
              colors.primary
            }
            backgroundColor={
              colors.terciary
            }
          />

          <MetricCard
            label="Clases de hoy"
            value={
              dashboard?.metrics
                ?.today_classes ?? 0
            }
            icon="today-outline"
            iconColor={
              colors.textWarning
            }
            backgroundColor={
              colors.textWarningBackground
            }
          />

        </View>

        <View
          style={{
            flexDirection: 'row',
            gap: 10,
            marginBottom: 24,
          }}
        >

          <MetricCard
            label="Clases de la semana"
            value={
              dashboard?.metrics
                ?.weekly_classes ?? 0
            }
            icon="calendar-outline"
            iconColor={
              colors.textSuccess
            }
            backgroundColor={
              colors.textSuccessBackground
            }
          />

          <MetricCard
            label="Pendientes"
            value={
              dashboard?.metrics
                ?.pendings ?? 0
            }
            icon="checkmark-circle-outline"
            iconColor={
              colors.error
            }
            backgroundColor={
              colors.textErrorBackground
            }
          />

        </View>

        {/* CLASE */}

        {!!classInfo && (

          <View
            style={{
              marginBottom: 24,
            }}
          >

            <Text
              variant="bodyLarge"
              style={{
                fontWeight: '700',
                marginBottom: 12,

                color:
                  isCurrentClass
                    ? colors.textSuccess
                    : colors.titleColor,
              }}
            >
              {
                isCurrentClass
                  ? 'Clase en curso'
                  : 'Próxima clase'
              }
            </Text>

            <Card
              mode="contained"
              style={{
                backgroundColor:
                  colors.primary,
              }}
            >

              <Card.Content>

                {isCurrentClass && (

                  <View
                    style={{
                      alignSelf:
                        'flex-start',

                      backgroundColor:
                        colors.textSuccessBackground,

                      paddingHorizontal:
                        10,

                      paddingVertical:
                        4,

                      borderRadius: 20,

                      marginBottom: 10,
                    }}
                  >

                    <Text
                      style={{
                        color:
                          colors.textSuccess,

                        fontWeight:
                          '700',
                      }}
                    >
                      EN CURSO
                    </Text>

                  </View>

                )}

                <Text
                  variant="titleLarge"
                  style={{
                    color: 'white',
                    fontWeight:
                      '700',
                  }}
                >
                  {classInfo.academy}
                </Text>

                <Text
                  style={{
                    color:
                      '#FFE0EA',
                    marginTop: 4,
                  }}
                >
                  Grupo {classInfo.classroom}
                </Text>

                <View
                  style={{
                    backgroundColor:
                      'rgba(255,255,255,0.15)',

                    padding: 12,

                    borderRadius: 16,

                    marginTop: 16,
                  }}
                >

                  {isCurrentClass ? (

                    <>

                      <Text
                        style={{
                          color: 'white',
                          fontWeight: '700',
                        }}
                      >
                        Clase activa
                      </Text>

                      <Text
                        style={{
                          color: 'white',
                          marginTop: 4,
                        }}
                      >
                        Finaliza a las{' '}
                        {
                          classInfo.end_time
                            ?.substring(0, 5)
                        }
                      </Text>

                    </>

                  ) : (

                    <>

                      <View style={{
                        flexDirection: 'row',
                        gap: 5,
                        marginBottom: 5,
                      }}>
                        <Ionicons
                          name="calendar-outline"
                          size={18}
                          color={
                            colors.white
                          }
                        />
                        <Text
                          style={{
                            color: 'white',
                          }}
                        >
                          {
                            getDayName(
                              classInfo.day_of_week,
                            )
                          }
                        </Text>
                      </View>

                      <View style={{
                        flexDirection: 'row',
                        gap: 5,
                      }}>
                        <Ionicons
                          name="time-outline"
                          size={18}
                          color={
                            colors.white
                          }
                        />
                        <Text
                          style={{
                            color: 'white',
                          }}
                        >
                          {
                          classInfo.start_time
                              ?.substring(0, 5)
                          }
                          {' - '}
                          {
                            classInfo.end_time
                              ?.substring(0, 5)
                          }
                        </Text>
                      </View>

                    </>

                  )}

                </View>

              </Card.Content>

            </Card>

          </View>

        )}

        {/* PENDIENTES */}

        <View>

          <Text
            variant="bodyLarge"
            style={{
              fontWeight: '700',
              marginBottom: 12,
            }}
          >
            Próximos pendientes
          </Text>

          <Card
            mode="contained"
            style={{
              backgroundColor:
                colors.cardBackground,
            }}
          >

            <Card.Content>

              {visiblePendings.length > 0 ? (

                <>

                  {visiblePendings.map(
                    pending => (

                      <View

                        key={
                          pending.id
                        }

                        style={{
                          flexDirection:
                            'row',

                          alignItems:
                            'center',

                          paddingVertical:
                            12,

                          borderBottomWidth:
                            1,

                          borderColor:
                            colors
                              .outlineVariant,
                        }}
                      >

                        <Ionicons
                          name="ellipse-outline"
                          size={18}
                          color={
                            colors.primary
                          }
                        />

                        <View
                          style={{
                            flex: 1,
                            marginLeft: 10,
                          }}
                        >

                          <Text
                            variant="titleMedium"
                          >
                            {pending.title}
                          </Text>

                          <Text
                            style={{
                              color:
                                colors.textColor,
                            }}
                          >
                            {
                              pending
                                .assignment
                                ?.academy
                                ?.name
                            }

                            {' • '}

                            {
                              pending
                                .assignment
                                ?.classroom
                                ?.degree
                            }

                            °

                            {
                              pending
                                .assignment
                                ?.classroom
                                ?.group
                            }
                          </Text>

                        </View>

                        <Text>
                          {
                            pending
                              .due_date
                          }
                        </Text>

                      </View>

                    ),
                  )}

                  {remainingPendings > 0 && (

                    <View
                      style={{
                        paddingTop: 12,
                      }}
                    >

                      <Text
                        style={{
                          textAlign:
                            'center',

                          color:
                            colors.primary,

                          fontWeight:
                            '700',
                        }}
                      >
                        +{remainingPendings} más
                      </Text>

                    </View>

                  )}

                </>

              ) : (

                <View
                  style={{
                    alignItems: 'center',
                    paddingVertical: 20,
                  }}
                >

                  <Ionicons
                    name="checkmark-circle-outline"
                    size={56}
                    color={
                      colors.primary
                    }
                  />

                  <Text
                    variant="titleMedium"
                    style={{
                      marginTop: 12,
                      textAlign: 'center',
                    }}
                  >
                    No tienes pendientes registrados
                  </Text>

                  <Text
                    style={{
                      marginTop: 6,
                      textAlign: 'center',
                      color:
                        colors.textColor,
                    }}
                  >
                    Crea tu primer pendiente para comenzar.
                  </Text>

                  <Button
                    mode="contained"
                    icon="plus"
                    style={{
                      marginTop: 16,
                    }}
                    labelStyle={{
                      color:colors.white
                    }}
                    onPress={() =>
                      navigation.navigate(
                        'PendingForm',
                      )
                    }
                  >
                    Crear pendiente
                  </Button>

                </View>

              )}

            </Card.Content>

          </Card>

        </View>

      </ScrollView>

    </SafeAreaView>

  );
};