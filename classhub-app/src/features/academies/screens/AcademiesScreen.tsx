import { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { Card, Text, ActivityIndicator } from 'react-native-paper';
import { AcademiesApi } from '../services/academies.api';

type Academy = {
  id: number;
  name: string;
  classrooms_count: number;
  classrooms: { id: number; name: string }[];
};

export const AcademiesScreen = ({ navigation }: any) => {

  const [data, setData] = useState<Academy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const result = await AcademiesApi.getAll();
      setData(result);
    } catch (error) {
      console.error('Error loading academies', error);
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
        Mis Academias
      </Text>

      {data.map((academy) => (
        <Card
          key={academy.id}
          style={{ marginBottom: 12 }}
          onPress={() =>
            navigation.navigate('Classrooms', {
              academyId: academy.id,
              academyName: academy.name,
            })
          }
        >
          <Card.Content>

            <Text variant="titleMedium">
              {academy.name}
            </Text>

            <Text variant="bodyMedium">
              Salones: {academy.classrooms_count}
            </Text>

          </Card.Content>
        </Card>
      ))}

    </ScrollView>
  );
};