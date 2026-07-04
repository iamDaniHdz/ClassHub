import { View } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import { useAuthStore } from '../../auth/store/auth.store';

export const SchoolSelectionScreen = ({ navigation }: any) => {

  const { logout } = useAuthStore();

  const { schools, setCurrentSchool } = useAuthStore();

  return (
    <View style={{ padding: 16 }}>

      <Text variant="titleLarge" style={{ marginBottom: 16 }}>
        Selecciona tu escuela
      </Text>

      {schools.map((school) => (
        <Card
          key={school.id}
          style={{ marginBottom: 10 }}
          onPress={() => setCurrentSchool(school.id)}
        >
          <Card.Content>
            <Text>{school.name}</Text>
          </Card.Content>
        </Card>
      ))}

      <>
      <Button mode="contained" onPress={async () => {
          await logout();
          navigation.replace('Login');
        }} >
              Logout
            </Button>
</>

    </View>
  );
};