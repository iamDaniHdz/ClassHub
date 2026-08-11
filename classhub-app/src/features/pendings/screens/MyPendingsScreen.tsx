import React, { useCallback, useMemo, useState } from 'react';

import {
  RefreshControl,
  SectionList,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';

import {
  ActivityIndicator,
  Card,
  Checkbox,
  Divider,
  FAB,
  Text,
  Dialog,
  useTheme,
  Portal,
  Button,
} from 'react-native-paper';

import { PendingsApi } from '../services/pendings.api';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { PendingDetailModal } from './PendingDetailModal';
import { useFocusEffect } from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';

import moment from 'moment';
import 'moment/locale/es';

moment.locale('es')

interface Pending {
  id: number;
  title: string;
  description: string;
  due_date: string;
  is_completed: boolean;

  assignment: {
    academy?: {
      name: string;
    };

    classroom?: {
      name: string;
    };
  };
}

const formatLocalDate = (date: Date): string => {
  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(2, '0');

  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

export const MyPendingsScreen = () => {
  const { colors } = useTheme() as any;

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [pendings, setPendings] = useState<Pending[]>([]);

  const [selectedPending, setSelectedPending] = useState<Pending | null>(null);

  const [detailVisible, setDetailVisible] = useState(false);

  const [
    deleteVisible,
    setDeleteVisible,
  ] = useState(false);

  const [
    pendingToDelete,
    setPendingToDelete,
  ] = useState<Pending | null>(
    null,
  );

  const navigation = useNavigation<any>();
  
  const deletePending =
    async () => {

      if (!pendingToDelete) {
        return;
      }

      try {

        await PendingsApi.delete(
          pendingToDelete.id,
        );

        setPendings(current =>
          current.filter(
            item =>
              item.id !==
              pendingToDelete.id,
          ),
        );

      } catch (error) {

        console.error(error);

      } finally {

        setDeleteVisible(false);

        setPendingToDelete(null);
      }
    };

  const load = useCallback(async () => {
    try {
      const data = await PendingsApi.getAll();

      setPendings(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {

      load();

    }, [load]),
  );

  const today = useMemo(() => {
    return formatLocalDate(new Date());
  }, []);

  const overduePendings =
  useMemo(() => {

    return pendings.filter(
      pending =>
        pending.due_date < today &&
        !pending.is_completed,
    );

  }, [
    pendings,
    today,
  ]);

  const upcomingPendings = useMemo(() => {

    return pendings.filter(
      pending =>
        pending.due_date >= today &&
        !pending.is_completed,
    );

  }, [
    pendings,
    today,
  ]);

  const completedPendings = useMemo(() => {
    return pendings.filter(pending => pending.is_completed);
  }, [pendings]);

  const sections = useMemo(() => {

    const data: any[] = [];

    if (overduePendings.length) {

      data.push({
        title: 'Atrasadas',
        data: overduePendings,
      });
    }

    if (upcomingPendings.length) {

      data.push({
        title: 'Pendientes',
        data: upcomingPendings,
      });
    }

    if (completedPendings.length) {

      data.push({
        title: 'Completadas',
        data: completedPendings,
      });
    }

    return data;

  }, [
    overduePendings,
    upcomingPendings,
    completedPendings,
  ]);

  const togglePending = async (pendingId: number, value: boolean) => {
    const previous = [...pendings];

    setPendings(current =>
      current.map(item =>
        item.id === pendingId
          ? {
              ...item,
              is_completed: value,
            }
          : item,
      ),
    );

    try {
      await PendingsApi.toggleCompleted(pendingId, value);

      if (selectedPending?.id === pendingId) {
        setSelectedPending({
          ...selectedPending,
          is_completed: value,
        });
      }
    } catch (error) {
      setPendings(previous);

      console.error(error);
    }
  };

  const renderPending = ({
  item,
}: {
  item: Pending;
}) => {

  const isOverdue =
    item.due_date < today &&
    !item.is_completed;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => {
        setSelectedPending(item);

        setDetailVisible(true);
      }}

      onLongPress={() => {
        setPendingToDelete(item);
        setDeleteVisible(true);
      }}
    >
      <Card
        mode="contained"
        style={[styles.taskCard, { backgroundColor: colors.cardBackground }]}
      >
        <Card.Content>
          <View style={styles.taskRow}>
            <Checkbox
              status={item.is_completed ? 'checked' : 'unchecked'}
              color="#4CAF50"
              onPress={() => togglePending(item.id, !item.is_completed)}
            />

            <View style={styles.content}>
              <Text
                variant="titleMedium"
                style={{
                  textDecorationLine: item.is_completed
                    ? 'line-through'
                    : 'none',

                  opacity: item.is_completed ? 0.55 : 1,
                }}
              >
                {item.title}
              </Text>

              {/* {!!item.description && (
                <Text
                  style={{
                    marginTop: 4,

                    color: colors.outline,

                    textDecorationLine: item.is_completed
                      ? 'line-through'
                      : 'none',

                    opacity: item.is_completed ? 0.55 : 1,
                  }}
                >
                  {item.description}
                </Text>
              )} */}

              <Text
                style={{
                  marginTop: 2,
                  color: colors.outline,
                }}
              >
                {item.assignment?.academy?.name}
                {' • '}
                {item.assignment?.classroom?.name}
              </Text>

              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 5,
                marginTop: 3,
              }}>
                <Ionicons
                  name={'calendar-outline'}
                  size={18}
                  color={
                    item.is_completed
                      ? colors.success
                      : isOverdue
                      ? colors.error
                      : colors.warning
                  }
                />

                <Text
                  style={{
                    color: isOverdue ? colors.error : colors.textColor,
                  }}
                >
                  {
                    moment(item.due_date)
                      .format('ddd DD, MMMM YYYY')
                  }
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor: item.is_completed
                    ? colors.success
                    : isOverdue
                    ? colors.error
                    : colors.warning,
                },
              ]}
            />
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <>
      <SectionList
        style={{
          flex: 1,
          backgroundColor: colors.background,
        }}
        sections={sections}
        keyExtractor={item => item.id.toString()}
        renderItem={renderPending}
        renderSectionHeader={({ section }) => (
          <View
            style={{
              flexDirection: 'row',
              alignSelf: 'flex-start',
              alignItems: 'center',
              gap: 5,
            }}
          >
            <Text
              variant='labelLarge'
              style={{
                color: colors.titleColor,
                marginBottom: 10,
              }}
            >
              {section.title}
            </Text>
          </View>
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              load();
            }}
          />
        }
        contentContainerStyle={{
          padding: 16,
        }}
        ListHeaderComponent={
          <View>
            <Text
              variant="headlineSmall"
              style={{
                color: colors.titleColor,
                marginBottom: 4,
                fontWeight: 'bold',
              }}
            >
              Mis pendientes
            </Text>

            <Text
              variant="bodyLarge"
              style={{
                color: colors.textColor,
                marginBottom: 20,
              }}
            >
              Organiza tus actividades
            </Text>

            <View style={styles.statsRow}>
              <Card
                mode="contained"
                style={[
                  styles.statCard,
                  {
                    backgroundColor: colors.cardBackground,
                  },
                ]}
              >
                <Card.Content>
                  <View
                    style={{
                      backgroundColor: colors.textErrorBackground,

                      alignSelf: 'center',

                      padding: 8,

                      borderRadius: 10,

                      marginBottom: 5,
                    }}
                  >
                    <Ionicons
                      name="alert-circle-outline"
                      size={25}
                      color={colors.error}
                    />
                  </View>

                  <Text
                    variant="labelSmall"
                    style={{
                      color: colors.textColor,
                      textAlign: 'center',
                    }}
                  >
                    Atrasadas
                  </Text>

                  <Text
                    variant="headlineMedium"
                    style={{
                      textAlign: 'center',
                    }}
                  >
                    {overduePendings.length}
                  </Text>
                </Card.Content>
              </Card>

              <Card
                mode="contained"
                style={[
                  styles.statCard,
                  { backgroundColor: colors.cardBackground },
                ]}
              >
                <Card.Content>
                  <View
                    style={{
                      backgroundColor: colors.textWarningBackground,
                      alignSelf: 'center',
                      padding: 8,
                      borderRadius: 10,
                      marginBottom: 5,
                    }}
                  >
                    <Ionicons
                      name={'calendar-outline'}
                      size={25}
                      color={colors.textWarning}
                    />
                  </View>
                  <Text
                    variant="labelSmall"
                    style={{ color: colors.textColor, textAlign: 'center' }}
                  >
                    Pendientes
                  </Text>

                  <Text
                    variant="headlineMedium"
                    style={{ textAlign: 'center' }}
                  >
                    {upcomingPendings.length}
                  </Text>
                </Card.Content>
              </Card>

              <Card
                mode="contained"
                style={[
                  styles.statCard,
                  { backgroundColor: colors.cardBackground },
                ]}
              >
                <Card.Content>
                  <View
                    style={{
                      backgroundColor: colors.textSuccessBackground,
                      alignSelf: 'center',
                      padding: 8,
                      borderRadius: 10,
                      marginBottom: 5,
                    }}
                  >
                    <Ionicons
                      name={'checkmark-circle-outline'}
                      size={25}
                      color={colors.textSuccess}
                    />
                  </View>
                  <Text
                    variant="labelSmall"
                    style={{ color: colors.textColor, textAlign: 'center' }}
                  >
                    Completadas
                  </Text>

                  <Text
                    variant="headlineMedium"
                    style={{ textAlign: 'center' }}
                  >
                    {completedPendings.length}
                  </Text>
                </Card.Content>
              </Card>
            </View>

            <Divider
              style={{
                marginVertical: 24,
                backgroundColor: colors.titleColor,
              }}
            />
          </View>
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
              name={'school-outline'}
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
              No tienes pendientes
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
              Cuando tengas pendientes aparecerán aquí
            </Text>
          </View>
        }
      />

      <FAB
        icon="plus"
        color="white"
        style={{
          position: 'absolute',
          right: 16,
          bottom: 16,
          backgroundColor: colors.primary,
        }}
        onPress={() => navigation.navigate('PendingForm')}
      />

      <PendingDetailModal
        visible={detailVisible}
        pending={selectedPending}
        onClose={() => {
          setDetailVisible(false);

          setSelectedPending(null);
        }}
        onToggleCompleted={value => {
          if (!selectedPending) {
            return;
          }

          togglePending(selectedPending.id, value);
        }}
      />

      <Portal>
        <Dialog
          style={{
            backgroundColor: colors.cardBackground,
          }}
          visible={deleteVisible}
          onDismiss={() => setDeleteVisible(false)}
        >
          <Dialog.Title>Eliminar pendiente</Dialog.Title>

          <Dialog.Content>
            <Text>
              ¿Deseas eliminar el pendiente
              {' "'}
              {pendingToDelete?.title}
              {'"'}?
            </Text>
          </Dialog.Content>

          <Dialog.Actions>
            <Button
              textColor={colors.titleColor}
              onPress={() => setDeleteVisible(false)}
            >
              Cancelar
            </Button>

            <Button textColor={colors.error} onPress={deletePending}>
              Eliminar
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,

    justifyContent: 'center',

    alignItems: 'center',
  },

  statsRow: {
    flexDirection: 'row',

    gap: 10,
  },

  statCard: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  sectionTitle: {
    marginTop: 12,

    marginBottom: 10,
  },

  taskCard: {
    marginBottom: 12,
  },

  taskRow: {
    flexDirection: 'row',

    alignItems: 'flex-start',
  },

  content: {
    flex: 1,

    marginRight: 12,
  },

  statusDot: {
    width: 10,

    height: 10,

    borderRadius: 5,

    marginTop: 12,
  },
});
