import { View } from 'react-native';
import { Text } from 'react-native-paper';

export const CalendarScreen = () => {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text variant="headlineSmall">
        Calendario
      </Text>

      <Text>
        Próximamente calendario académico.
      </Text>
    </View>
  );
};