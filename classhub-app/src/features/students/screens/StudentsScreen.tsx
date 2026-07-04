import { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { Text, TextInput, Card, ActivityIndicator } from 'react-native-paper';
import { StudentsApi } from '../services/students.api';

export const StudentsScreen = ({ route, navigation }: any) => {

  const { classroomId, classroomName } = route.params;

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    load();
  }, []);

  const load = async (query = '') => {
    try {
      setLoading(true);
      const result = await StudentsApi.getByClassroom(classroomId, query);
      
        console.log('RESULT:', result);

      
      setData(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Text variant="titleLarge" style={{ margin: 16 }}>
        {classroomName}
      </Text>

      <TextInput
        placeholder="Buscar alumno..."
        value={search}
        onChangeText={(text) => {
          setSearch(text);
          load(text);
        }}
        style={{ marginHorizontal: 16, marginBottom: 12 }}
      />

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} />
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          {data.map((student) => (
            <Card
                key={`student-${student.id}`}
                style={{ marginBottom: 12 }}
                onPress={() =>
                navigation.navigate('StudentDetail', {
                    studentAssignmentId: student.id,
                })
            }
            >
              <Card.Content>
                <Text variant="titleMedium">
                  {student.student.name} {student.student.paternal_surname}
                </Text>
              </Card.Content>
            </Card>
          ))}
        </ScrollView>
      )}
    </>
  );
};