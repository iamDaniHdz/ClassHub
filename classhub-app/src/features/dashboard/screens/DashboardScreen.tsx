import React, {
  useCallback,
  useState,
} from 'react';

import {
  RefreshControl,
  ScrollView,
  TouchableOpacity,
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
  useEffect,
} from 'react';

import Ionicons from 'react-native-vector-icons/Ionicons';

import { DashboardApi } from '../services/dashboard.api';

import { useAuthStore } from '../../auth/store/auth.store';

export const DashboardScreen = ({
  navigation,
}: any) => {

  const { user } =
    useAuthStore();

  const {
    schools,
    currentSchoolId,
  } = useAuthStore();

  const currentSchool =
    schools.find(
      school =>
        school.id ===
        currentSchoolId,
    );

  const {
    setCurrentSchool,
  } = useAuthStore();

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

  useEffect(() => {

    if (!currentSchoolId) {
      return;
    }

    load();

  }, [
    currentSchoolId,
    load,
  ]);

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

  const todayWeekDay =
    new Date().getDay() === 0
      ? 7
      : new Date().getDay();

  const nextClassBadge =
    !isCurrentClass &&
    classInfo
      ? classInfo.day_of_week ===
        todayWeekDay
        ? classInfo.start_time?.substring(
            0,
            5,
          )
        : getDayName(
            classInfo.day_of_week,
          )
      : null;

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
        backgroundColor: colors.cardBackground,
      }}
    >
      <Card.Content>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
          <Text
            variant="headlineLarge"
            style={{
              textAlign: 'left',
            }}
          >
            {value}
          </Text>

          <View
            style={{
              alignSelf: 'center',
              backgroundColor,
              borderRadius: 12,
              padding: 10,
            }}
          >
            <Ionicons name={icon} size={24} color={iconColor} />
          </View>
        </View>
        <View>
          <Text
            style={{
              textAlign: 'left',
              marginTop: 8,
              color:
                colors.textColor,
            }}
          >
            {label}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );

  const NavCard = ({
    label,
    route,
    icon,
    iconColor,
    backgroundColor,
  }: any) => (

    <TouchableOpacity
     
      onPress={() => {

        navigation.navigate(route);

      }}
      style={{
        flex: 1,
        
      }}
    >
      <View
          style={{
            alignItems: 'center',
          }}
        >

          <View
            style={{
              backgroundColor,
              borderRadius: 16,
              padding: 12,
            }}
          >

            <Ionicons
              name={icon}
              size={26}
              color={iconColor}
            />

          </View>

          <Text
            style={{
              marginTop: 10,
              textAlign: 'center',
              color:
                colors.textColor,
              fontWeight: '600',
            }}
          >

            {label}

          </Text>

        </View>

    </TouchableOpacity>
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
        backgroundColor: colors.background,
      }}
    >
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
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
            label={user?.name?.charAt(0)?.toUpperCase() ?? '?'}
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

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                marginTop: 4,
                gap: 10,
              }}
            >

              <Ionicons
                name="school-outline"
                size={16}
                color={
                  colors.primary
                }
              />

              <Text
                variant="bodySmall"
                numberOfLines={2}
                style={{
                  color:
                    colors.primary,
                  width: '80%'
                }}
              >
                {currentSchool?.name}
              </Text>

            </View>

          </View>
        </View>

        {/* NAV */}

        <View
          style={{
            flexDirection: 'row',
            gap: 10,
            marginBottom: 24,
          }}
        >

          <NavCard
            label="Cambiar escuela"
            route="SchoolSelection"
            icon="school-outline"
            iconColor={
              colors.primary
            }
            backgroundColor={
              colors.tertiary
            }
          />

          <NavCard
            label="Agregar pendiente"
            route="PendingForm"
            icon="add-circle-outline"
            iconColor={
              colors.primary
            }
            backgroundColor={
              colors.tertiary
            }
          />

          <NavCard
            label="Perfil"
            route="Profile"
            icon="person-circle-outline"
            iconColor={
              colors.primary
            }
            backgroundColor={
              colors.tertiary
            }
          />

          <NavCard
            label="Ajustes"
            route="Settings"
            icon="settings-outline"
            iconColor={
              colors.primary
            }
            backgroundColor={
              colors.tertiary
            }
          />

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
            value={dashboard?.metrics?.academies ?? 0}
            icon="school-outline"
            iconColor={colors.primary}
            backgroundColor={colors.background}
          />

          <MetricCard
            label="Clases de hoy"
            value={dashboard?.metrics?.today_classes ?? 0}
            icon="today-outline"
            iconColor={colors.primary}
            backgroundColor={colors.background}
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
            value={dashboard?.metrics?.weekly_classes ?? 0}
            icon="calendar-outline"
            iconColor={colors.primary}
            backgroundColor={colors.background}
          />

          <MetricCard
            label="Pendientes"
            value={dashboard?.metrics?.pendings ?? 0}
            icon="checkmark-circle-outline"
            iconColor={colors.primary}
            backgroundColor={colors.background}
          />
        </View>

        {/* CLASE */}

        {!classInfo && (
          <View
            style={{
              marginBottom: 24,
            }}
          >
            <Text
              variant="labelLarge"
              style={{
                marginBottom: 12,

                color: colors.titleColor,
              }}
            >
              Próxima clase
            </Text>

            <Card mode='contained'
            style={{backgroundColor:colors.tertiary}}>
              <Card.Content>
                <View
                  style={{
                    alignItems: 'center',
                    paddingVertical: 20,
                  }}
                >
                  <Ionicons
                    name="school-outline"
                    size={56}
                    color={colors.primary}
                  />

                  <Text
                    variant="titleMedium"
                    style={{
                      marginTop: 12,
                      textAlign: 'center',
                      color: colors.titleColor
                    }}
                  >
                    No tienes clases registradas
                  </Text>

                  <Text
                    style={{
                      marginTop: 6,
                      textAlign: 'center',
                      color: colors.textColor,
                    }}
                  >
                    Espera a que un administrador te asigne una clase
                  </Text>
                </View>
              </Card.Content>
            </Card>
          </View>
        )}

        {!!classInfo && (
          <View
            style={{
              marginBottom: 24,
            }}
          >
            <Text
              variant="labelLarge"
              style={{
                marginBottom: 12,

                color: isCurrentClass ? colors.textSuccess : colors.titleColor,
              }}
            >
              {isCurrentClass ? 'Clase en curso' : 'Próxima clase'}
            </Text>

            <Card
              mode="contained"
              style={{
                backgroundColor: colors.primary,
              }}
              onPress={() => {

                navigation.navigate(
                  'ClassroomDetail',
                  {
                    classroomId: classInfo.classroom.id,
                    academyName: classInfo.academy.name,
                  },
                );

              }}
            >
              <Card.Content>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >

                  <View
                    style={{
                      width: '70%',
                    }}
                  >

                    <Text
                      numberOfLines={2}
                      variant="titleLarge"
                      style={{
                        color: 'white',
                        fontWeight: '700',
                        fontSize: 20
                      }}
                    >
                      {classInfo?.academy?.name}
                    </Text>

                    <Text
                      style={{
                        color: '#FFE0EA',
                        marginTop: 4,
                      }}
                    >
                      Grupo {classInfo?.classroom?.name}
                    </Text>

                  </View>

                  <View
                    style={{
                      width: '30%',
                      alignItems: 'flex-end',
                    }}
                  >

                    {isCurrentClass ? (
                      <View
                        style={{
                          backgroundColor:
                            colors.textSuccessBackground,
                          paddingHorizontal: 10,
                          paddingVertical: 4,
                          borderRadius: 20,
                        }}
                      >
                        <Text
                          style={{
                            color:
                              colors.textSuccess,
                            fontWeight: '700',
                          }}
                        >
                          En curso
                        </Text>
                      </View>
                    ) : (
                      <View
                        style={{
                          backgroundColor:
                            colors.cardBackground,
                          paddingHorizontal: 10,
                          paddingVertical: 4,
                          borderRadius: 20,
                        }}
                      >
                        <Text
                          style={{
                            color:
                              colors.primary,
                            fontWeight: '700',
                          }}
                        >
                          {nextClassBadge}
                        </Text>
                      </View>
                    )}

                  </View>

                </View>

                <View
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.15)',

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
                        Finaliza a las {classInfo?.end_time?.substring(0, 5)}
                      </Text>
                    </>
                  ) : (
                    <>
                      <View
                        style={{
                          flexDirection: 'row',
                          gap: 5,
                          marginBottom: 5,
                        }}
                      >
                        <Ionicons
                          name="calendar-outline"
                          size={18}
                          color={colors.white}
                        />
                        <Text
                          style={{
                            color: 'white',
                          }}
                        >
                          {getDayName(classInfo?.day_of_week)}
                        </Text>
                      </View>

                      <View
                        style={{
                          flexDirection: 'row',
                          gap: 5,
                        }}
                      >
                        <Ionicons
                          name="time-outline"
                          size={18}
                          color={colors.white}
                        />
                        <Text
                          style={{
                            color: 'white',
                          }}
                        >
                          {classInfo?.start_time?.substring(0, 5)}
                          {' - '}
                          {classInfo?.end_time?.substring(0, 5)}
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
            variant="labelLarge"
            style={{
              marginBottom: 12,
            }}
          >
            Próximos pendientes
          </Text>

          <Card
            mode="contained"
            style={{
              backgroundColor: colors.cardBackground,
            }}
          >
            <Card.Content>
              {visiblePendings.length > 0 ? (
                <>
                  {visiblePendings.map(pending => (
                    <View
                      key={pending.id}
                      style={{
                        flexDirection: 'row',

                        alignItems: 'center',

                        paddingVertical: 12,

                        borderBottomWidth: 1,

                        borderColor: colors.outlineVariant,
                      }}
                    >
                      <Ionicons
                        name="ellipse-outline"
                        size={18}
                        color={colors.primary}
                      />

                      <View
                        style={{
                          flex: 1,
                          marginLeft: 10,
                        }}
                      >
                        <Text variant="titleMedium">{pending.title}</Text>

                        <Text
                          style={{
                            color: colors.textColor,
                          }}
                        >
                          {pending.assignment?.academy?.name}
                          {' • '}
                          {pending.assignment?.classroom?.degree}°
                          {pending.assignment?.classroom?.group}
                        </Text>
                      </View>

                      <Text>{pending.due_date}</Text>
                    </View>
                  ))}

                  {remainingPendings > 0 && (
                    <View
                      style={{
                        paddingTop: 12,
                      }}
                    >
                      <Text
                        style={{
                          textAlign: 'center',

                          color: colors.primary,

                          fontWeight: '700',
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
                    color={colors.primary}
                  />

                  <Text
                    variant="titleMedium"
                    style={{
                      marginTop: 12,
                      textAlign: 'center',
                      color: colors.titleColor
                    }}
                  >
                    No tienes pendientes registrados
                  </Text>

                  <Text
                    style={{
                      marginTop: 6,
                      textAlign: 'center',
                      color: colors.textColor,
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
                      color: colors.white,
                    }}
                    onPress={() => navigation.navigate('PendingForm')}
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