import React from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Button, Card, Text, useTheme } from 'react-native-paper';
import { useAuthStore } from '../../auth/store/auth.store';
import Ionicons from 'react-native-vector-icons/Ionicons';
export const SchoolSelectionScreen = ({ navigation }: any) => {
  const { colors } = useTheme() as any;
  const { logout, schools, setCurrentSchool } = useAuthStore();
  const handleSelectSchool = async (school: any) => {
    await setCurrentSchool(school.id);
    navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
  };
  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-start',
          marginBottom: 10,
          marginTop: 16,
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
              marginBottom: 4,
              fontWeight: 'bold',
            }}
          >
            Selecciona tu escuela
          </Text>
          <Text
            variant="bodyLarge"
            style={{
              color: colors.textColor,
            }}
          >
            Organiza tus clases
          </Text>
        </View>
      </View>
      <FlatList
        style={{padding: 16}}
        data={schools}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleSelectSchool(item)}
            style={styles.card}
            activeOpacity={0.5}
          >
            <Card
              mode="contained"
              style={[styles.cardInner, { backgroundColor: colors.tertiary }]}
            >
              <Card.Content style={styles.cardContent}>
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: colors.cardBackground },
                  ]}
                >
                  <Ionicons
                    name="school-outline"
                    size={30}
                    color={colors.primary}
                  />
                </View>
                <Text style={{ color: colors.primary }} numberOfLines={2}>
                  {item.name}
                </Text>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { paddingBottom: 16 },
  row: { justifyContent: 'space-between', marginBottom: 12 },
  card: { flex: 1, marginHorizontal: 4 },
  cardInner: {
    flex: 1,
    width: '100%',
    minHeight: 100,
    justifyContent: 'center',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    width: '75%',
  },
  iconContainer: { borderRadius: 100, padding: 10, alignSelf: 'flex-start' },
});
