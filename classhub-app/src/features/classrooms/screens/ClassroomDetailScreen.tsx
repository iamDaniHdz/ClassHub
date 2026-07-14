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
} from 'react-native-paper';

import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppTheme } from '../../../theme/useAppTheme';

import { ClassroomDetailApi } from '../services/classroomDetail.api';

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

  const theme = useAppTheme();

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
        backgroundColor:
          theme.background,
        padding: 16,
      }}
    >

      <Text
        variant="headlineMedium"
        style={{
          fontWeight: 'bold',
          marginBottom: 12,
        }}
      >
        GRUPO {classroomName}
      </Text>

      {/* Academia */}

      <Card
        style={{
          marginBottom: 20,
          backgroundColor:
            theme.primary,
        }}
      >
        <Card.Content>

          <Text
            style={{
              color: 'white',
            }}
          >
            👥 {studentsCount}
          </Text>

          <Text
            variant="titleMedium"
            style={{
              color: 'white',
              fontWeight: 'bold',
            }}
          >
            Academia:
          </Text>

          <Text
            variant="titleLarge"
            style={{
              color: 'white',
            }}
          >
            {academyName}
          </Text>

        </Card.Content>
      </Card>

      {/* Search */}

      <Searchbar
        placeholder="Buscar alumno"
        value={search}
        onChangeText={setSearch}
        style={{
          marginBottom: 16,
        }}
      />

      {/* Students */}

      <FlatList
        data={filteredStudents}
        keyExtractor={(item) =>
        item.student_assignment_id.toString()
        }
        renderItem={({ item }) => (
          <Card
            style={{
              marginBottom: 12,
            }}
            onPress={() =>
                navigation.navigate(
                    'StudentDetail',
                    {
                        studentAssignmentId:
                        item.student_assignment_id,
                    }
                )
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
                label={
                    item.student?.name?.charAt(0) ?? '?'
                }
              />

              <View
                style={{
                  flex: 1,
                  marginLeft: 12,
                }}
              >
                <Text
                  variant="titleMedium"
                >
                  {item?.student?.name}
                  {' '}
                  {item?.student?.paternal_surname}
                  {' '}
                  {item?.student?.maternal_surname}
                </Text>

                <Text>
                  Activo
                </Text>
              </View>

              <Text>
                &gt;
              </Text>

            </Card.Content>
          </Card>
        )}
      />

    </SafeAreaView>
  );
};