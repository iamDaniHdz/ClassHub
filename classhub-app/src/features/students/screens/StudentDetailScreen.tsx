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
  Button,
  Card,
  IconButton,
  Text,
  useTheme,
} from 'react-native-paper';

import { SafeAreaView } from 'react-native-safe-area-context';

import { StudentDetailApi } from '../services/studentDetail.api';
import { useAppTheme } from '../../../theme/useAppTheme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import React from 'react';
import CircularProgress from '../../../components/CircularProgress';

export const StudentDetailScreen = ({
  route,
  navigation
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

        <View style={{ position: 'relative' }}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1520763185298-1b434c919102',
            }}
            style={{height: 180, borderRadius: 20, margin: 16, }}
          />
          <IconButton
            icon="arrow-left"
            mode="contained"
            onPress={() => navigation.goBack()}
            style={{ position: 'absolute', top: 20, left: 20, backgroundColor:colors.white }}
          />
        </View>

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
            {data?.student?.full_name}
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
                backgroundColor: data?.student?.is_active
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
                  data?.student?.is_active
                    ? 'checkmark-circle-outline'
                    : 'close-circle-outline'
                }
                size={20}
                color={
                  data?.student?.is_active
                    ? colors.textSuccess
                    : colors.textError
                }
              />
              <Text
                variant="bodyMedium"
                style={{
                  color: data?.student?.is_active
                    ? colors.textSuccess
                    : colors.textError,
                }}
              >
                {data?.student?.is_active ? 'Activo' : 'Inactivo'}
              </Text>
            </View>
          </View>

          {/* ACADEMY */}

          <View
            style={{
              marginTop: 10,
              backgroundColor: colors.tertiary,
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 20,
              flexDirection: 'row',
              gap: 5,
            }}
          >
            <Ionicons
              name={'school-outline'}
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

        <View
          style={{
            paddingHorizontal: 20,
            marginTop: 30,
          }}
        >
          <Text
            variant="titleLarge"
            style={{
              marginBottom: 10,
              fontWeight: 'bold',
            }}
          >
            Metricas
          </Text>

          <View
            style={{
              flexDirection: 'row',
              gap: 10,
              justifyContent: 'center',
              marginTop: 10,
            }}
          >
            <CircularProgress
              progress={50}
              labelProgress="50%"
              label="Asignatura"
            />
            <CircularProgress
              progress={70}
              labelProgress="70pts"
              label="Promedio"
            />
            <CircularProgress
              progress={25}
              labelProgress="1/5"
              label="Tareas"
            />
            <CircularProgress
              progress={80}
              labelProgress="4/5"
              label="Asistencia"
            />
          </View>
        </View>

        {/* OBSERVACIONES */}

        <View
          style={{
            padding: 16,
          }}
        >
          <Text
            variant="titleLarge"
            style={{
              marginBottom: 10,
              fontWeight: 'bold',
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
              mode="contained"
              style={{
                flex: 1,
                marginRight: 10,
                backgroundColor: colors.cardBackground,
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