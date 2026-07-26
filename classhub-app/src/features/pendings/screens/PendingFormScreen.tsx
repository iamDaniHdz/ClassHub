import React, {
  useEffect,
  useState,
} from 'react';

import {
  View,
  ScrollView,
  StyleSheet,
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
import DateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from 'react-native-vector-icons/Ionicons';

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

  const [error, setError]
    = useState('');

  const [success, setSuccess]
    = useState('');

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

  const [showDatePicker, setShowDatePicker] =
    useState(false);

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
      
      console.log(academyAssignmentId);
      setError('');
      setSuccess('');

      if (
        !academyAssignmentId
      ) {
        setError('Seleccione una academia');
        setTimeout(() => {
          setError('');
        }, 4000);
        return;
      }

      try {

        setLoading(true);

        let response = await PendingsApi.create({
          academy_assignment_id:
            academyAssignmentId,

          title,

          description,

          due_date:
            dueDate,
        });

        console.log(response);
        setError('');
        setSuccess('Pendiente agregado exitosamente');
        
        setTimeout(() => {
          setSuccess('');
          navigation.goBack();
        }, 2000);
        

      } catch (error) {

        console.log(error.response.data.message);
        setError(error?.response?.data?.message || 'Ocurrio un error, intente mas tarde');
        setTimeout(() => {
          setError('');
        }, 4000);

      } finally {

        setLoading(false);
      }
    };

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 16,
        backgroundColor: colors.background,
        flex: 1,
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
        onDismiss={() => setMenuVisible(false)}
        anchor={
          <Button
            mode="contained"
            labelStyle={{ color: colors.primary }}
            style={{ backgroundColor: colors.terciary }}
            onPress={() => setMenuVisible(true)}
          >
            {academyLabel || 'Selecciona una academia'}
          </Button>
        }
      >
        {assignments.map(academy => (
          <Menu.Item
            key={academy.id}
            onPress={() => {
              setAcademyAssignmentId(academy.assignment_id);

              setAcademyLabel(
                `${academy.academy?.name} - ${academy.classroom?.name}`,
              );

              setMenuVisible(false);
            }}
            title={`${academy.academy?.name} - ${academy.classroom?.name}`}
          />
        ))}
      </Menu>

      <TextInput
        mode="outlined"
        style={[
          styles.input,
          { backgroundColor: colors.backgroundShadow, marginTop: 20 },
        ]}
        activeOutlineColor={colors.primary}
        outlineStyle={{ borderRadius: 14, borderWidth: 1 }}
        outlineColor={colors.backgroundShadow}
        textColor={colors.textColor}
        placeholderTextColor={colors.gray}
        value={title}
        onChangeText={setTitle}
        label="Título"
      />

      <TextInput
        mode="outlined"
        style={[
          styles.input,
          { backgroundColor: colors.backgroundShadow, marginTop: 20 },
        ]}
        activeOutlineColor={colors.primary}
        outlineStyle={{ borderRadius: 14, borderWidth: 1 }}
        outlineColor={colors.backgroundShadow}
        textColor={colors.textColor}
        placeholderTextColor={colors.gray}
        value={description}
        onChangeText={setDescription}
        label="Descripción"
      />

      <TextInput
        mode="outlined"
        style={[
          styles.input,
          {
            backgroundColor: colors.backgroundShadow,
            marginTop: 20,
          },
        ]}
        activeOutlineColor={colors.primary}
        outlineStyle={{
          borderRadius: 14,
          borderWidth: 1,
        }}
        outlineColor={colors.backgroundShadow}
        textColor={colors.textColor}
        label="Fecha límite"
        value={dueDate}
        editable={false}
        right={
          <TextInput.Icon
            icon="calendar"
            onPress={() => setShowDatePicker(true)}
          />
        }
        onPressIn={() => setShowDatePicker(true)}
      />

      {showDatePicker && (
        <DateTimePicker
          value={dueDate ? new Date(dueDate) : new Date()}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);

            if (!selectedDate) {
              return;
            }

            const year = selectedDate.getFullYear();

            const month = String(selectedDate.getMonth() + 1).padStart(2, '0');

            const day = String(selectedDate.getDate()).padStart(2, '0');

            setDueDate(`${year}-${month}-${day}`);
          }}
        />
      )}

      <View style={{ height: 40, justifyContent: 'center', marginTop: 40}}>
        {error ? (
          <View
            style={{
              backgroundColor: colors.textErrorBackground,
              paddingVertical: 8,
              paddingHorizontal: 16,
              borderRadius: 8,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              alignSelf:'center',
            }}
          >
             <Ionicons name={'alert-circle-outline'} size={20} color={colors.textError} />
            <Text
              variant="labelLarge"
              style={{ color: colors.textError, paddingHorizontal: 10 }}
            >
              {error || 'Ocurrio un error'}
            </Text>
          </View>
        ) : 
          success ? (
            <View
              style={{
                backgroundColor: colors.textSuccessBackground,
                paddingVertical: 8,
                paddingHorizontal: 16,
                borderRadius: 8,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf:'center',
              }}
            >
              <Ionicons name={'checkmark-circle-outline'} size={20} color={colors.success} />
              <Text
                variant="labelLarge"
                style={{ color: colors.textSuccess, paddingHorizontal: 10 }}
              >
                {success || 'Exito'}
              </Text>
            </View>
          ) : null
        }
      </View>

      <Button
        mode="contained"
        loading={loading}
        disabled={loading}
        style={{
          marginTop: 30,
        }}
        labelStyle={{
          color: colors.white,
        }}
        onPress={save}
      >
        Guardar pendiente
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  input: {
    borderRadius: 14,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    height: 56,
  },
});