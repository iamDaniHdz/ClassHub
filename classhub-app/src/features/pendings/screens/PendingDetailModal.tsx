import React from 'react';

import {
  ScrollView,
  View,
} from 'react-native';

import {
  Button,
  Checkbox,
  Modal,
  Portal,
  Text,
} from 'react-native-paper';

interface Props {

  visible: boolean;

  pending: any;

  onClose: () => void;

  onToggleCompleted: (
    value: boolean,
  ) => void;
}

export const PendingDetailModal = ({
  visible,
  pending,
  onClose,
  onToggleCompleted,
}: Props) => {

  if (!pending) {
    return null;
  }

  return (

    <Portal>

      <Modal

        visible={visible}

        onDismiss={onClose}

        contentContainerStyle={{
          backgroundColor: 'white',
          padding: 20,
          margin: 20,
          borderRadius: 16,
        }}
      >

        <ScrollView>

          <Text variant="headlineSmall">
            {pending.title}
          </Text>

          <Text
            style={{
              marginTop: 12,
            }}
          >
            {pending.description}
          </Text>

          <View
            style={{
              marginTop: 20,
            }}
          >

            <Text>
              Academia
            </Text>

            <Text variant="bodyLarge">
              {
                pending.assignment
                  ?.academy?.name
              }
            </Text>

          </View>

          <View
            style={{
              marginTop: 16,
            }}
          >

            <Text>
              Grupo
            </Text>

            <Text variant="bodyLarge">
              {
                pending.assignment
                  ?.classroom?.name
              }
            </Text>

          </View>

          <View
            style={{
              marginTop: 16,
            }}
          >

            <Text>
              Fecha límite
            </Text>

            <Text variant="bodyLarge">
              {pending.due_date}
            </Text>

          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 24,
            }}
          >

            <Checkbox

              status={
                pending.is_completed
                  ? 'checked'
                  : 'unchecked'
              }

              onPress={() =>
                onToggleCompleted(
                  !pending.is_completed,
                )
              }
            />

            <Text>
              Marcar como completado
            </Text>

          </View>

          <Button
            mode="contained"
            onPress={onClose}
            style={{
              marginTop: 24,
            }}
          >
            Cerrar
          </Button>

        </ScrollView>

      </Modal>

    </Portal>
  );
};