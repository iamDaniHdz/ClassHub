import { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { Text, Card, ActivityIndicator } from 'react-native-paper';
import { StudentDetailApi } from '../services/studentDetail.api';

export const StudentDetailScreen = ({ route }: any) => {

  const { studentAssignmentId } = route.params;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const result = await StudentDetailApi.getById(studentAssignmentId);
      setData(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 40 }} />;
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>

      <Text variant="titleLarge">
        {data.student.name} {data.student.paternal_surname}
      </Text>

      <Text variant="bodyMedium" style={{ marginBottom: 16 }}>
        {data.academy} - {data.classroom}
      </Text>

      {/* FALTAS */}
      <Card style={{ marginBottom: 12 }}>
        <Card.Content>
          <Text variant="titleMedium">Faltas</Text>
          <Text>{data.attendances_count}</Text>
        </Card.Content>
      </Card>

      {/* CALIFICACIONES */}
      <Card style={{ marginBottom: 12 }}>
        <Card.Content>
          <Text variant="titleMedium">Calificaciones</Text>

          {data.grades.map((g: any) => (
            <Text key={g.id}>
              {g.title}: {g.score}
            </Text>
          ))}
        </Card.Content>
      </Card>

      {/* ENTREGAS */}
      <Card>
        <Card.Content>
          <Text variant="titleMedium">Entregas</Text>

          {data.submissions.map((s: any) => (
            <Text key={s.id}>
              {s.title} - {s.status} ({s.score ?? '-'})
            </Text>
          ))}
        </Card.Content>
      </Card>

    </ScrollView>
  );
};