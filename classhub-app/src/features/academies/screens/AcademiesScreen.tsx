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
  Card,
  Searchbar,
  Text,
} from 'react-native-paper';

import { AcademiesApi } from '../services/academies.api';
import { useAppTheme } from '../../../theme/useAppTheme';
import { SafeAreaView } from 'react-native-safe-area-context';

type AcademyCard = {
  assignment_id: number;

  academy: {
    id: number;
    name: string;
  };

  classroom: {
    id: number;
    name: string;
  };

  teacher: {
    id: number;
    name: string;
  };

  students_count: number;
};

export const AcademiesScreen = ({
  navigation,
}: any) => {

  const theme = useAppTheme();

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState('');

  const [data, setData] = useState<
    AcademyCard[]
  >([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const result =
        await AcademiesApi.getAll();
      setData(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = useMemo(() => {

    if (!search.trim()) {
      return data;
    }

    return data.filter(item =>
      item.academy.name
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );
  }, [search, data]);

  const renderCard = ({
    item,
  }: {
    item: AcademyCard;
  }) => (
    <Card
      mode="elevated"
      style={{
        flex: 1,
        margin: 6,
        borderRadius: 16,
        overflow: 'hidden',
      }}
      onPress={() =>
        navigation.navigate(
          'ClassroomDetail',
          {
            classroomId: item.classroom.id,
            classroomName: item.classroom.name,
            academyName: item.academy.name,
            studentsCount: item.students_count,
          }
        )
      }
    >
      {/* PARTE SUPERIOR */}

      <View
        style={{
          backgroundColor:
            theme.primary,
          padding: 12,
          minHeight: 120,
        }}
      >
        <Text
          style={{
            color: '#FFF',
            fontWeight: '700',
            fontSize: 16,
          }}
        >
          {item.academy.name}
        </Text>

        <View
          style={{
            flexDirection: 'row',
            marginTop: 12,
            gap: 8,
          }}
        >
          <View
            style={{
              backgroundColor:
                '#FFF',
              paddingVertical: 4,
              paddingHorizontal: 10,
              borderRadius: 20,
            }}
          >
            <Text>
              {item.classroom.name}
            </Text>
          </View>

          <View
            style={{
              backgroundColor:
                '#FFF',
              paddingVertical: 4,
              paddingHorizontal: 10,
              borderRadius: 20,
            }}
          >
            <Text>
              👥{' '}
              {
                item.students_count
              }
            </Text>
          </View>
        </View>
      </View>

      {/* PARTE INFERIOR */}

      <View
        style={{
          backgroundColor:
            theme.secondary,
          padding: 12,
        }}
      >
        <Text
          style={{
            color: '#FFE7F0',
            fontSize: 12,
          }}
        >
          Docente
        </Text>

        <Text
          style={{
            color: '#FFF',
            fontWeight: '700',
          }}
          numberOfLines={2}
        >
          {item.teacher.name}
        </Text>
      </View>
    </Card>
  );

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
      }}
    >
      <FlatList
        data={filteredData}
        keyExtractor={item =>
          String(
            item.assignment_id
          )
        }
        numColumns={2}
        renderItem={renderCard}
        contentContainerStyle={{
          padding: 16,
        }}
        ListHeaderComponent={
          <>
            <Text
              variant="bodyLarge"
              style={{
                color:
                  theme.textColor,
                marginBottom: 8,
              }}
            >
              Tus asignaturas y
              grupos asignados
            </Text>

            <Text
              variant="headlineSmall"
              style={{
                marginBottom: 16,
                fontWeight: 'bold',
              }}
            >
              ACADEMIAS
            </Text>

            <Searchbar
              placeholder="Buscar academia"
              value={search}
              onChangeText={
                setSearch
              }
              style={{
                marginBottom: 16,
                borderRadius: 16,
              }}
            />
          </>
        }
      />
    </SafeAreaView>
  );
};