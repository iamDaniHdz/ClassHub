import React, {
  useCallback,
  useMemo,
  useState,
} from 'react';

import {
  FlatList,
  StyleSheet,
  View,
} from 'react-native';

import {
  ActivityIndicator,
  Avatar,
  Button,
  Card,
  Searchbar,
  Text,
  useTheme,
} from 'react-native-paper';

import { SafeAreaView } from 'react-native-safe-area-context';

import { ClassroomDetailApi } from '../services/classroomDetail.api';

import Ionicons from 'react-native-vector-icons/Ionicons';

import {
  useFocusEffect,
} from '@react-navigation/native';

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

  const [refreshing, setRefreshing] =
    useState(false);

  const [search, setSearch] =
    useState('');

  const [data, setData] =
    useState<any>(null);

  
  const load = useCallback(async () => {

    try {

      const result =
        await ClassroomDetailApi.getById(
          classroomId,
        );

      setData(result);

      console.log(result);
      

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

      setRefreshing(false);
    }

  }, [classroomId]);

  const onRefresh = () => {

    setRefreshing(true);

    load();
  };


  useFocusEffect(
    useCallback(() => {

      load();

    }, [load]),
  );
    
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
    <>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: colors.background,
        }}
      >
        <View style={styles.header}>
          <Button
            mode="text"
            icon="arrow-left"
            onPress={() => navigation.goBack()}
          ></Button>
          <View>
            <Text
              variant="headlineSmall"
              style={{
                color: colors.titleColor,
                marginBottom: 4,
                fontWeight: 'bold',
              }}
            >
              GRUPO {data?.name}
            </Text>

            <Text
              variant="bodyLarge"
              style={{
                color: colors.textColor,
              }}
            >
              Detalles del grupo
            </Text>
          </View>
        </View>
      </View>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: colors.background,
          padding: 16,
        }}
      >
        {/* Academia */}

        <Card
          style={{
            marginBottom: 20,
            backgroundColor: colors.primary,
            flexDirection: 'row',
          }}
        >
          <Card.Content
            style={{
              flexDirection: 'row',
              gap: 20,
            }}
          >
            <View
              style={{
                backgroundColor: colors.backgroundShadow,
                borderRadius: 15,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                paddingHorizontal: 14,
                paddingVertical: 5,
                alignSelf: 'center',
              }}
            >
              <Ionicons
                name={'school-outline'}
                size={20}
                color={colors.primary}
              />
              <Text
                variant="headlineSmall"
                style={{
                  color: colors.primary,
                }}
              >
                {(data?.students_count ?? 0).toString().padStart(2, '0')}
              </Text>
            </View>

            <View
              style={{
                width: '70%',
              }}
            >
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
                  fontWeight: 'bold',
                }}
              >
                {data?.academy?.name || academyName}
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
          refreshing={refreshing}
          onRefresh={onRefresh}
          keyExtractor={item => item.student_assignment_id.toString()}
          renderItem={({ item }) => (
            <Card
              mode="contained"
              style={{
                marginBottom: 12,
                backgroundColor: colors.cardBackground,
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
                  <Text variant="titleMedium">{item?.student?.full_name}</Text>

                  <View
                    style={{
                      flexDirection: 'row',
                      gap: 5,
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
                      <Ionicons
                        name={'person-circle-outline'}
                        size={20}
                        color={colors.primary}
                      />
                      <Text
                        variant="bodyMedium"
                        style={{ color: colors.primary }}
                      >
                        {item?.student?.student_enrollment ?? 'Sin matricula'}
                      </Text>
                    </View>

                    <View
                      style={{
                        backgroundColor: item?.student?.is_active
                          ? colors.textSuccessBackground
                          : colors.textErrorBackground,
                        borderRadius: 20,
                        flexDirection: 'row',
                        alignSelf: 'baseline',
                        gap: 5,
                        paddingVertical: 5,
                        paddingHorizontal: 10,
                      }}
                    >
                      <Ionicons
                        name={
                          item?.student?.is_active
                            ? 'checkmark-circle-outline'
                            : 'close-circle-outline'
                        }
                        size={20}
                        color={
                          item?.student?.is_active
                            ? colors.textSuccess
                            : colors.textError
                        }
                      />
                      <Text
                        variant="bodyMedium"
                        style={{
                          color: item?.student?.is_active
                            ? colors.textSuccess
                            : colors.textError,
                        }}
                      >
                        {item?.student?.is_active ? 'Activo' : 'Inactivo'}
                      </Text>
                    </View>
                  </View>
                </View>

                <Ionicons
                  name={'arrow-forward'}
                  size={20}
                  color={colors.textColor}
                />
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
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    marginTop: 16,
    paddingHorizontal: 16,
  },
});