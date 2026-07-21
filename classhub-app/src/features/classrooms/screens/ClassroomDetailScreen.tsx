import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  FlatList,
  View,
} from 'react-native';

import {
  ActivityIndicator,
  Avatar,
  Card,
  Searchbar,
  Text,
  useTheme,
} from 'react-native-paper';

import { SafeAreaView } from 'react-native-safe-area-context';

import { ClassroomDetailApi } from '../services/classroomDetail.api';

import Ionicons from 'react-native-vector-icons/Ionicons';

export const ClassroomDetailScreen = ({
  route,
  navigation,
}: any) => {

  const {
    classroomId,
    classroomName,
    academyName,
    studentsCount,
  } = route.params;

  const { colors } = useTheme() as any;
  
  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState('');

  const [data, setData] =
    useState<any>(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {

      const result =
        await ClassroomDetailApi.getById(
          classroomId
        );

      setData(result);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
    
    const filteredStudents =
    useMemo(() => {

        if (!data?.students) {
        return [];
        }

        const query = search
        .trim()
        .toLowerCase();

        return data.students.filter(item => {

        const fullName = [
            item.student?.name,
            item.student?.paternal_surname,
            item.student?.maternal_surname,
        ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase();

        return fullName.includes(query);
        });

    }, [search, data]);

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
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.background,
        padding: 16,
      }}
    >
      <Text
        variant="bodyLarge"
        style={{
          color: colors.textColor,
          marginBottom: 8,
        }}
      >
        Detalles del grupo
      </Text>

      <Text
        variant="headlineMedium"
        style={{
          marginBottom: 16,
          fontWeight: 'bold',
        }}
      >
        GRUPO {classroomName}
      </Text>

      {/* Academia */}

      <Card
        style={{
          marginBottom: 20,
          backgroundColor: colors.primary,
          flexDirection: 'row',
        }}
      >
        <Card.Content style={{
          flexDirection: 'row',
          gap: 20,
        }}>
          <View style={{
            backgroundColor: colors.backgroundShadow,
            borderRadius: 15,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            paddingHorizontal: 14,
            paddingVertical: 5,
            alignSelf: 'center',
          }}>
            <Ionicons name={'school-outline'} size={20} color={colors.primary} />
            <Text
              variant="headlineSmall"
              style={{
                color: colors.primary,
              }}
            >
              {studentsCount < 10 ? `0${studentsCount}` : studentsCount}
            </Text>
          </View>

          <View style={{
            width: '70%'
          }}>
            <Text
              variant="bodyLarge"
              style={{
                color: colors.white,
              }}
            >
              Academia:
            </Text>

            <Text
              variant="titleLarge"
              style={{
                color: colors.white,
                fontWeight: 'bold'
              }}
            >
              {academyName}
            </Text>
          </View>
        </Card.Content>
      </Card>

      {/* Search */}

      <Searchbar
        placeholder="Buscar alumno"
        value={search}
        onChangeText={setSearch}
        style={{
          marginBottom: 16,
          borderRadius: 26,
          backgroundColor: colors.backgroundShadow,
        }}
      />

      {/* Students */}

      <FlatList
        data={filteredStudents}
        keyExtractor={item => item.student_assignment_id.toString()}
        renderItem={({ item }) => (
          <Card
            mode='contained'
            style={{
              marginBottom: 12,
              backgroundColor: colors.cardBackground
            }}
            onPress={() =>
              navigation.navigate('StudentDetail', {
                studentAssignmentId: item.student_assignment_id,
              })
            }
          >
            <Card.Content
              style={{
                flexDirection: 'row',
                alignItems: 'center',

              }}
            >
              <Avatar.Text
                size={46}
                label={item.student?.name?.charAt(0) ?? '?'}
              />

              <View
                style={{
                  flex: 1,
                  marginLeft: 12,
                }}
              >
                <Text variant="titleMedium">
                  {item?.student?.name} {item?.student?.paternal_surname}{' '}
                  {item?.student?.maternal_surname}
                </Text>

                <View style={{
                  backgroundColor:colors.textSuccessBackground,
                  borderRadius: 20,
                  flexDirection: 'row',
                  alignSelf: 'baseline',
                  gap: 5,
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                }}>
                  <Ionicons name={'checkmark-circle'} size={20} color={colors.textSuccess} />
                  <Text variant='bodyMedium' style={{color:colors.textSuccess}}>Activo</Text>
                </View>
              </View>

              <Ionicons name={'arrow-forward'} size={20} color={colors.textColor} />
            </Card.Content>
          </Card>
        )}
        ListEmptyComponent={
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 60,
            }}
          >
            <Ionicons
              name={search ? 'search-outline' : 'people-outline'}
              size={64}
              color={colors.outline}
            />

            <Text
              variant="titleMedium"
              style={{
                marginTop: 16,
                fontWeight: 'bold',
                textAlign: 'center',
              }}
            >
              {search
                ? 'No se encontraron alumnos'
                : 'No hay alumnos asignados'}
            </Text>

            <Text
              variant="bodyMedium"
              style={{
                marginTop: 8,
                textAlign: 'center',
                color: colors.onSurfaceVariant,
                paddingHorizontal: 24,
              }}
            >
              {search
                ? 'Intenta con otro término de búsqueda.'
                : 'Cuando haya alumnos asignados al grupo aparecerán aquí.'}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};