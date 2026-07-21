import { useEffect, useState } from 'react';

import {
  Image,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import {
  ActivityIndicator,
  Avatar,
  Card,
  IconButton,
  Text,
  TextInput,
  useTheme,
} from 'react-native-paper';

import { SafeAreaView } from 'react-native-safe-area-context';

import { StudentDetailApi } from '../services/studentDetail.api';
import { useAppTheme } from '../../../theme/useAppTheme';
import Ionicons from 'react-native-vector-icons/Ionicons';

export const StudentDetailScreen = ({
  route,
}: any) => {

  const theme = useAppTheme();
  const { colors } = useTheme() as any;

  const [observations, setObservations] = useState('');

  const { studentAssignmentId } =
    route.params;

  const [loading, setLoading] =
    useState(true);

  const [data, setData] =
    useState<any>(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {

      const result =
        await StudentDetailApi.getById(
          studentAssignmentId
        );

      setData(result);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ActivityIndicator
        style={{
          marginTop: 40,
        }}
      />
    );
  }

  const average =
    data.grades.length > 0
      ? (
          data.grades.reduce(
            (
              acc: number,
              item: any
            ) =>
              acc +
              Number(item.score),
            0
          ) /
          data.grades.length
        ).toFixed(0)
      : 0;

  const tasksCompleted =
    data.submissions.filter(
      (s: any) =>
        s.status === 'graded'
    ).length;

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.background,
      }}
    >
      <ScrollView>
        {/* COVER */}

        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1520763185298-1b434c919102',
          }}
          style={{
            //width: '100%',
            height: 180,
            marginHorizontal: 15,
            marginTop: 10,
            borderRadius: 20,
          }}
        />

        {/* AVATAR */}

        <View
          style={{
            alignItems: 'center',
            marginTop: -55,
          }}
        >
          <Avatar.Text
            size={110}
            label={data.student.name?.charAt(0)?.toUpperCase() ?? '?'}
          />
        </View>

        {/* NAME */}

        <View
          style={{
            alignItems: 'center',
            paddingHorizontal: 20,
          }}
        >
          <Text
            variant="headlineSmall"
            style={{
              fontWeight: 'bold',
              textAlign: 'center',
              marginTop: 16,
            }}
          >
            {data.student.name} {data.student.paternal_surname}{' '}
            {data.student.maternal_surname}
          </Text>

          {/* STATUS */}

          <View
            style={{
              flexDirection: 'row',
              marginTop: 12,
              gap: 8,
            }}
          >
            <View
              style={{
                backgroundColor: colors.textSuccessBackground,
                borderRadius: 20,
                flexDirection: 'row',
                alignSelf: 'baseline',
                gap: 5,
                paddingVertical: 5,
                paddingHorizontal: 10,
              }}
            >
              <Ionicons
                name={'checkmark-circle'}
                size={20}
                color={colors.textSuccess}
              />
              <Text variant="bodyMedium" style={{ color: colors.textSuccess }}>
                Activo
              </Text>
            </View>
          </View>

          {/* ACADEMY */}

          <View
            style={{
              marginTop: 10,
              backgroundColor: colors.terciary,
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 20,
              flexDirection: 'row',
              gap: 5
            }}
          >
            <Ionicons
                name={'school'}
                size={20}
                color={colors.primary}
              />
            <Text
              style={{
                color: theme.primary,
              }}
            >
              {data.academy}
            </Text>
          </View>
        </View>

        {/* METRICS */}

        <View style={{
          backgroundColor:'red',
          paddingHorizontal: 20,
          marginTop: 30,
        }}>
          <Text variant='headlineSmall'>
            Asignatura
          </Text>
          
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
            }}
          >
            <Card style={{ flex: 1, margin: 4 }}>
              <Card.Content>
                <Text variant="titleLarge">50%</Text>
                <Text>Progreso</Text>
              </Card.Content>
            </Card>

            <Card style={{ flex: 1, margin: 4 }}>
              <Card.Content>
                <Text variant="titleLarge">{average}</Text>
                <Text>Promedio</Text>
              </Card.Content>
            </Card>

            <Card style={{ flex: 1, margin: 4 }}>
              <Card.Content>
                <Text variant="titleLarge">
                  {tasksCompleted}/{data.submissions.length}
                </Text>

                <Text>Tareas</Text>
              </Card.Content>
            </Card>

            <Card style={{ flex: 1, margin: 4 }}>
              <Card.Content>
                <Text variant="titleLarge">{data.attendances_count}</Text>

                <Text>Faltas</Text>
              </Card.Content>
            </Card>
          </View>
        </View>

        {/* OBSERVACIONES */}

        <View
          style={{
            padding: 16,
          }}
        >
          <Text
            variant="headlineSmall"
            style={{
              marginBottom: 10,
            }}
          >
            Observaciones
          </Text>

          <View
            style={{
              flexDirection: 'row',
            }}
          >
            <Card
              style={{
                flex: 1,
                marginRight: 10,
              }}
            >
              <Card.Content>
                <Text>Sin observaciones registradas por el momento.</Text>
              </Card.Content>
            </Card>

            {/* <TextInput              
              placeholder="Ingrese las observaciones del alumno"
              mode="outlined"
              style={[styles.input, {backgroundColor:colors.backgroundShadow}]}
              activeOutlineColor= {colors.primary}
              outlineStyle = {{borderRadius:14, borderWidth: 1}}
              outlineColor={colors.backgroundShadow}
              textColor={colors.textColor}
              placeholderTextColor={colors.gray}
              keyboardType="email-address"
              value={observations}
              onChangeText={text => setObservations(text)}
            /> */}

            <Card
              style={{
                width: 70,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: theme.primary,
              }}
            >
              <IconButton icon="plus" iconColor="#FFF" size={30} />
            </Card>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  input: {
    borderRadius: 20,
    height: 150,
  },
});