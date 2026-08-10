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
  Avatar,
  Card,
  Searchbar,
  Text,
  useTheme,
} from 'react-native-paper';

import { AcademiesApi } from '../services/academies.api';
import { useAppTheme } from '../../../theme/useAppTheme';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';

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
        marginBottom: 12,
        borderRadius: 20,
        backgroundColor:
          colors.cardBackground,
        width: '100%',
      }}
      onPress={() =>
        navigation.navigate(
          'ClassroomDetail',
          {
            classroomId:
              item.classroom.id,
            academyName: item.academy.name
          },
        )
      }
    >

      <Card.Content
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >

        {/* ICONO */}

        <View
          style={{
            width: 70,
            height: 70,

            borderRadius: 35,

            backgroundColor:
              colors.primary,

            justifyContent: 'center',

            alignItems: 'center',

            marginRight: 16,
          }}
        >

          <Ionicons
            name="school-outline"
            size={32}
            color={colors.white}
          />

          <Text
            style={{
              color:
                colors.white,

              fontWeight:
                '700',

              fontSize: 12,
            }}
          >
            {item.classroom.name}
          </Text>

        </View>

        {/* INFO */}

        <View
          style={{
            flex: 1,
          }}
        >

          <Text
            variant="titleLarge"
            style={{
              fontWeight: '700',
              color:
                colors.titleColor,
            }}
          >
            {item.academy.name}
          </Text>

          <View
            style={{
              flexDirection: 'row',

              alignItems: 'center',

              marginTop: 4,
            }}
          >

            <Text
              style={{
                color:
                  colors.primary,

                fontWeight:
                  '600',
              }}
            >
              Grupo {item.classroom.name} {'  '}|
            </Text>

            <Ionicons
              name="person-circle-outline"
              size={16}
              color={
                colors.primary
              }
              style={{
                marginLeft: 8,
                marginRight: 4,
              }}
            />

            <Text
              style={{
                color:
                  colors.primary,
              }}
            >
              {item.students_count < 10
                ? `0${item.students_count}`
                : item.students_count} Alumnos
            </Text>

          </View>

        </View>
      </Card.Content>

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
        backgroundColor: theme.background,
      }}
    >
      <FlatList
        data={filteredData}
        keyExtractor={item => String(item.assignment_id)}
        refreshing={refreshing}
        onRefresh={onRefresh}
        renderItem={renderCard}
        contentContainerStyle={{
          padding: 16,
        }}
        ListHeaderComponent={
          <>
            <Text
              variant="headlineSmall"
              style={{
                color: colors.titleColor,
                marginBottom: 4,
                fontWeight: 'bold',
              }}
            >
              Mis academias
            </Text>

            <Text
              variant="bodyLarge"
              style={{
                color: colors.textColor,
                marginBottom: 20,
              }}
            >
              Tus asignaturas y grupos asignados
            </Text>

            <Searchbar
              placeholder="Buscar academia"
              value={search}
              onChangeText={setSearch}
              style={{
                marginBottom: 16,
                borderRadius: 26,
                backgroundColor: colors.backgroundShadow,
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
                ? `No se encontraron resultados`
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