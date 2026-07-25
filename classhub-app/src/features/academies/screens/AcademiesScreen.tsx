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
  Searchbar,
  Text,
  useTheme,
} from 'react-native-paper';

import { AcademiesApi } from '../services/academies.api';
import { useAppTheme } from '../../../theme/useAppTheme';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';2

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
  const { colors } = useTheme() as any;
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState('');

  const [data, setData] = useState<
    AcademyCard[]
  >([]);

  const load = useCallback(async () => {

    try {

      const result =
        await AcademiesApi.getAll();

      setData(result);

    } catch (e) {

      console.error(e);

    } finally {

      setLoading(false);
    }

  }, []);


  useFocusEffect(
    useCallback(() => {

      load();

    }, [load]),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
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
      mode="contained"
      style={{
        flex: 1,
        margin: 6,
        borderRadius: 16,
        overflow: 'hidden',
        maxWidth: '47%'
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
          backgroundColor:theme.secondary,
          padding: 12,
          minHeight: 120,
        }}
      >
        <Text
          style={{
            color: colors.white,
            fontWeight: '700',
            fontSize: 16,
            height: 50,
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
              backgroundColor:colors.backgroundShadow,
              paddingVertical: 4,
              paddingHorizontal: 10,
              borderRadius: 20,
              width: '48%',
              alignItems: 'center',
            }}
          >
            <Text
            variant='bodyLarge'
            style={{
              color:colors.primary
            }}>
              {item.classroom.name}
            </Text>
          </View>

          <View
            style={{
              backgroundColor:colors.backgroundShadow,
              paddingVertical: 4,
              paddingHorizontal: 10,
              borderRadius: 20,
              flexDirection: 'row',
              gap: 5,
              width: '48%',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons
              name={'school-outline'}
              size={20}
              color={colors.primary}
            />
            <Text
            variant='bodyLarge'
            style={{
              color:colors.primary
            }}>
              {item.students_count < 10 ? `0${item.students_count}` : item.students_count}
            </Text>
          </View>
        </View>
      </View>

      {/* PARTE INFERIOR */}

      <View
        style={{
          backgroundColor:
            theme.primary,
          padding: 12,
        }}
      >
        <Text
          style={{
            color: colors.white,
            fontSize: 12,
          }}
        >
          Docente
        </Text>

        <Text
          style={{
            color: colors.white,
            fontWeight: '700',
          }}
          numberOfLines={2}
        >
          {item.teacher.name.replace(/\s+/g, ' ').trim()}
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
        refreshing={refreshing}
        onRefresh={onRefresh}
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
              Tus asignaturas y grupos asignados
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
                borderRadius: 26,
                backgroundColor:colors.backgroundShadow,
              }}
            />
          </>
        }
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
              name={search ? 'search-outline' : 'school-outline'}
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
                ?  `No se encontraron resultados`
                : 'No tienes academias asignadas'}
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
                : 'Cuando tengas academias asignadas aparecerán aquí.'}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};