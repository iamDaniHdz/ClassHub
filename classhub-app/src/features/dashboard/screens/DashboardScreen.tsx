import React from 'react';
import {
  ScrollView,
  View,
} from 'react-native';

import {
  Avatar,
  Card,
  IconButton,
  Text,
} from 'react-native-paper';

import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuthStore } from '../../auth/store/auth.store';
import { useAppTheme } from '../../../theme/useAppTheme';

export const DashboardScreen = () => {

  const { user } = useAuthStore();
  const theme = useAppTheme();

  const academies = [
    {
      id: 1,
      name: 'Humanidades 2',
      icon: 'brain',
    },
    {
      id: 2,
      name: 'Orientación Profesional',
      icon: 'school',
    },
    {
      id: 3,
      name: 'Danza Moderna',
      icon: 'dance-ballroom',
    },
  ];

  const pendingTasks = [
    {
      id: 1,
      title: 'Subir calificaciones',
      subtitle: 'Humanidades 2 | 1° D',
      date: 'Jul 20',
      completed: true,
    },
    {
      id: 2,
      title: 'Calificar ADAS',
      subtitle: 'Orientación Profesional | 2° I',
      date: 'Jul 22',
      completed: false,
    },
    {
      id: 3,
      title: 'Añadir pendiente',
      subtitle: '',
      date: '',
      completed: false,
    },
  ];

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.background,
      }}
    >
      <ScrollView
        contentContainerStyle={{
          padding: 20,
        }}
      >

        {/* HEADER */}

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 24,
            gap: 10,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >

            <Avatar.Image
              size={44}
              source={{
                uri:
                  'https://i.pravatar.cc/300',
              }}
            />
          </View>
          <View>
            <Text
              variant="bodyMedium"
              style={{
                color: theme.textColor,
              }}
            >
              Hola {user?.role?.name}
            </Text>

            <Text
              variant="headlineSmall"
              style={{
                fontWeight: 'bold',
                color: theme.titleColor,
              }}
            >
              {user?.name}
            </Text>
          </View>

          
        </View>

        {/* ACADEMIAS */}

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{
            marginBottom: 24,
          }}
        >
          {academies.map(item => (
            <Card
              key={item.id}
              style={{
                width: 120,
                marginRight: 12,
                backgroundColor:
                  '#FCE8EF',
              }}
            >
              <Card.Content
                style={{
                  alignItems: 'center',
                }}
              >
                <Avatar.Icon
                  size={48}
                  icon={item.icon}
                  color={theme.primary}
                  style={{
                    backgroundColor:
                      'transparent',
                  }}
                />

                <Text
                  style={{
                    textAlign: 'center',
                    marginTop: 8,
                  }}
                >
                  {item.name}
                </Text>
              </Card.Content>
            </Card>
          ))}
        </ScrollView>

        {/* PRÓXIMA CLASE */}

        <View
          style={{
            marginBottom: 20,
          }}
        >
          <Text
            variant="bodyLarge"
            style={{
              fontWeight: 'bold',
              marginBottom: 12,
            }}
          >
            Próxima clase →
          </Text>

          <Card
            style={{
              backgroundColor:
                theme.primary,
              borderRadius: 24,
            }}
          >
            <Card.Content>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 16,
                }}
              >
                <Avatar.Icon
                  size={52}
                  icon="book-open-page-variant"
                  style={{
                    backgroundColor:
                      '#B05A78',
                  }}
                />

                <View
                  style={{
                    marginLeft: 12,
                  }}
                >
                  <Text
                    variant="titleLarge"
                    style={{
                      color: 'white',
                      fontWeight: 'bold',
                    }}
                  >
                    Orientación Profesional
                  </Text>

                  <Text
                    style={{
                      color: '#FFE0EA',
                    }}
                  >
                    Grupo 2° I
                  </Text>
                </View>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  backgroundColor:
                    'rgba(255,255,255,0.15)',
                  padding: 12,
                  borderRadius: 16,
                }}
              >
                <Text
                  style={{
                    color: 'white',
                  }}
                >
                  📅 Vie, 17 Jul 2026
                </Text>

                <Text
                  style={{
                    color: 'white',
                  }}
                >
                  ⏰ 11:05 AM - 11:50 AM
                </Text>
              </View>

            </Card.Content>
          </Card>
        </View>

        {/* PENDIENTES */}

        <View>
          <Text
            variant="bodyLarge"
            style={{
              fontWeight: 'bold',
              marginBottom: 12,
            }}
          >
            Pendientes →
          </Text>

          <Card
            style={{
              backgroundColor:
                theme.cardBackground,
              borderRadius: 20,
            }}
          >
            <Card.Content>

              {pendingTasks.map(task => (
                <View
                  key={task.id}
                  style={{
                    flexDirection: 'row',
                    justifyContent:
                      'space-between',
                    alignItems: 'center',
                    paddingVertical: 12,
                    borderBottomWidth:
                      task.id !==
                      pendingTasks.length
                        ? 1
                        : 0,
                    borderColor: '#E0E0E0',
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      flex: 1,
                    }}
                  >
                    <IconButton
                      icon={
                        task.completed
                          ? 'check-circle'
                          : 'circle-outline'
                      }
                      iconColor={
                        task.completed
                          ? theme.primary
                          : theme.textColor
                      }
                    />

                    <View>
                      <Text
                        variant="titleMedium"
                      >
                        {task.title}
                      </Text>

                      {!!task.subtitle && (
                        <Text
                          style={{
                            color:
                              theme.textColor,
                          }}
                        >
                          {task.subtitle}
                        </Text>
                      )}
                    </View>
                  </View>

                  {!!task.date && (
                    <Text>
                      {task.date}
                    </Text>
                  )}
                </View>
              ))}

            </Card.Content>
          </Card>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};