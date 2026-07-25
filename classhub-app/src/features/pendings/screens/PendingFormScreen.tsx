import React, {
  useEffect,
  useState,
} from 'react';

import {
  View,
  ScrollView,
} from 'react-native';

import {
  Button,
  Menu,
  Text,
  TextInput,
  useTheme,
} from 'react-native-paper';

import { AcademiesApi } from '../../academies/services/academies.api';
import { PendingsApi } from '../services/pendings.api';

export const PendingFormScreen = ({
  navigation,
}: any) => {

  const { colors } =
    useTheme() as any;

  const [loading, setLoading] =
    useState(false);

  const [assignments, setAssignments] =
    useState<any[]>([]);

  const [menuVisible, setMenuVisible] =
    useState(false);

  const [
    academyAssignmentId,
    setAcademyAssignmentId,
  ] = useState<
    number | null
  >(null);

  const [
    academyLabel,
    setAcademyLabel,
  ] = useState('');

  const [title, setTitle] =
    useState('');

  const [
    description,
    setDescription,
  ] = useState('');

  const [dueDate, setDueDate] =
    useState('');

  useEffect(() => {

    loadAssignments();

  }, []);

  const loadAssignments =
    async () => {

      try {

        const data =
            await AcademiesApi.getAll();

            setAssignments(data);

        

      } catch (error) {

        console.error(error);
      }
    };

  const save =
    async () => {        

      if (
        !academyAssignmentId
      ) {
        return;
      }

      try {

        setLoading(true);

        await PendingsApi.create({
          academy_assignment_id:
            academyAssignmentId,

          title,

          description,

          due_date:
            dueDate,
        });

        navigation.goBack();

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);
      }
    };

  return (

    <ScrollView
      contentContainerStyle={{
        padding: 16,
      }}
    >

      <Text
        variant="headlineSmall"
        style={{
          marginBottom: 20,
        }}
      >
        Nuevo pendiente
      </Text>

      <Menu

        visible={menuVisible}

        onDismiss={() =>
          setMenuVisible(false)
        }

        anchor={

          <Button
            mode="outlined"
            onPress={() =>
              setMenuVisible(
                true,
              )
            }
          >
            {
              academyLabel ||
              'Selecciona una academia'
            }
          </Button>

        }
      >

        {assignments.map(academy => (

            <Menu.Item

              key={academy.id}

              onPress={() => {

                setAcademyAssignmentId(
                  academy.assignment_id,
                );

                setAcademyLabel(
                  `${academy.academy?.name} - ${academy.classroom?.name}`,
                );

                setMenuVisible(
                  false,
                );
              }}

              title={
                `${academy.academy?.name} - ${academy.classroom?.name}`
              }
            />

          ),
        )}

      </Menu>

      <TextInput
        label="Título"
        value={title}
        onChangeText={
          setTitle
        }
        style={{
          marginTop: 20,
        }}
      />

      <TextInput
        label="Descripción"
        value={description}
        onChangeText={
          setDescription
        }
        multiline
        style={{
          marginTop: 20,
        }}
      />

      <TextInput
        label="Fecha límite"
        value={dueDate}
        onChangeText={
          setDueDate
        }
        placeholder="2026-10-20"
        style={{
          marginTop: 20,
        }}
      />

      <Button
        mode="contained"
        loading={loading}
        disabled={loading}
        style={{
          marginTop: 30,
        }}
        onPress={save}
      >
        Guardar pendiente
      </Button>

    </ScrollView>
  );
};