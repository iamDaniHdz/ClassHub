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
  Chip,
  Menu,
  Text,
  TextInput,
  useTheme,
} from 'react-native-paper';

import { AcademiesApi } from '../../academies/services/academies.api';
import { PendingsApi } from '../services/pendings.api';
import DateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from 'react-native-vector-icons/Ionicons';

import moment from 'moment';
import 'moment/locale/es';
moment.locale('es');

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
    <>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-start',
          paddingTop: 16,
          backgroundColor:colors.background
        }}
      >
        <Button
          mode="text"
          icon="arrow-left"
          onPress={() => navigation.goBack()}
        ></Button>
        <View>
          <Text
            variant="headlineSmall"
            style={{
              color: colors.titleColor,
              fontWeight: 'bold',
            }}
          >
            Nuevo pendiente
          </Text>
        </View>
      </View>
      <ScrollView
        contentContainerStyle={{
          padding: 16,
          backgroundColor: colors.background,
          flex: 1,
        }}
      >
        <Text style={{color:colors.gray}}>
          Academia
        </Text>
        {/* <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Button
              mode="contained"
              labelStyle={{ color: colors.primary }}
              style={{ backgroundColor: colors.tertiary }}
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
        </Menu> */}

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16, marginTop: 5,}}>
          {assignments.map(academy => (
            <Chip
              key={`${academy.id}-${academy.assignment_id}`}
              mode="outlined"
              showSelectedCheck={false}
              selected={academy.assignment_id === academyAssignmentId}
              selectedColor={colors.primary}
              style={{
                borderWidth: academy.assignment_id === academyAssignmentId ? 1 : 0,
                backgroundColor:
                  academy.assignment_id === academyAssignmentId
                    ? colors.primary + '20' // 20 ≈ transparencia
                    : colors.backgroundShadow,
              }}
              onPress={() => {
                setAcademyAssignmentId(academy.assignment_id);

                setAcademyLabel(
                  `${academy.academy?.name} · ${academy.classroom?.name}`,
                );
              }}
            >
              <Text style={{
                color:colors.textColor
              }}>
                {academy.academy?.name} · {academy.classroom?.name}
              </Text>
            </Chip>
          ))}
        </View>

        <Text style={{color:colors.gray}}>
          Título
        </Text>

        <TextInput
          mode="outlined"
          style={[
            styles.input,
            { backgroundColor: colors.backgroundShadow },
          ]}
          activeOutlineColor={colors.primary}
          outlineStyle={{ borderRadius: 14, borderWidth: 1 }}
          outlineColor={colors.backgroundShadow}
          textColor={colors.textColor}
          placeholderTextColor={colors.gray}
          value={title}
          onChangeText={setTitle}
        />

        <Text style={{ color: colors.gray }}>
          Descripción
        </Text>

        <TextInput
          mode="outlined"
          multiline
          scrollEnabled
          numberOfLines={6}
          style={[
            styles.input,
            {
              backgroundColor: colors.backgroundShadow,
              height: 150,
              textAlignVertical: 'top',
            },
          ]}
          activeOutlineColor={colors.primary}
          outlineStyle={{ borderRadius: 14, borderWidth: 1 }}
          outlineColor={colors.backgroundShadow}
          textColor={colors.textColor}
          placeholderTextColor={colors.gray}
          value={description}
          onChangeText={setDescription}
        />

        <Text style={{color:colors.gray}}>
          Fecha límite
        </Text>

        <TextInput
          mode="outlined"
          style={[
            styles.input,
            {
              backgroundColor: colors.backgroundShadow,
            },
          ]}
          activeOutlineColor={colors.primary}
          outlineStyle={{
            borderRadius: 14,
            borderWidth: 1,
          }}
          outlineColor={colors.backgroundShadow}
          textColor={colors.textColor}
          value={
            dueDate
              ? moment(dueDate).format('DD [de] MMMM [de] YYYY')
              : ''
          }
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
            value={
              dueDate
                ? (() => {
                    const [year, month, day] = dueDate.split('-');

                    return new Date(
                      Number(year),
                      Number(month) - 1,
                      Number(day),
                    );
                  })()
                : new Date()
            }
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);

              if (event.type === 'dismissed') {
                return;
              }

              if (!selectedDate) {
                return;
              }

              const year = selectedDate.getFullYear();
              const month = String(
                selectedDate.getMonth() + 1,
              ).padStart(2, '0');
              const day = String(
                selectedDate.getDate(),
              ).padStart(2, '0');

              setDueDate(`${year}-${month}-${day}`);
            }}
          />
        )}

        <View style={{ height: 40, justifyContent: 'center', marginTop: 40 }}>
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
                alignSelf: 'center',
              }}
            >
              <Ionicons
                name={'alert-circle-outline'}
                size={20}
                color={colors.textError}
              />
              <Text
                variant="labelLarge"
                style={{ color: colors.textError, paddingHorizontal: 10 }}
              >
                {error || 'Ocurrio un error'}
              </Text>
            </View>
          ) : success ? (
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
                alignSelf: 'center',
              }}
            >
              <Ionicons
                name={'checkmark-circle-outline'}
                size={20}
                color={colors.success}
              />
              <Text
                variant="labelLarge"
                style={{ color: colors.textSuccess, paddingHorizontal: 10 }}
              >
                {success || 'Exito'}
              </Text>
            </View>
          ) : null}
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
    </>
  );
};

const styles = StyleSheet.create({
  input: {
    marginBottom: 16,
    marginTop: 5,
    borderRadius: 14,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    height: 56,
  },
});