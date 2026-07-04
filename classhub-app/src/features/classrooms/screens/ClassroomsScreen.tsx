import { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { Card, Text, ActivityIndicator } from 'react-native-paper';
import { ClassroomsApi } from '../services/classrooms.api';

export const ClassroomsScreen = ({ route, navigation }: any) => {

  const { academyId, academyName } = route.params;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const result = await ClassroomsApi.getByAcademy(academyId);
      setData(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 40 }} />;
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>

      <Text variant="titleLarge" style={{ marginBottom: 16 }}>
        {academyName}
      </Text>

      {data.map((classroom: any) => (
        <Card
          key={classroom.id}
          style={{ marginBottom: 12 }}
          onPress={() =>
            navigation.navigate('Students', {
              classroomId: classroom.id,
              classroomName: classroom.name,
            })
          }
        >
          <Card.Content>
            <Text variant="titleMedium">
              {classroom.name}
            </Text>

            <Text>
              Alumnos: {classroom.students_count}
            </Text>
          </Card.Content>
        </Card>
      ))}

    </ScrollView>
  );
};