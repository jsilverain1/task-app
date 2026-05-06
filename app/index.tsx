import { FlatList, StyleSheet, Text, View } from 'react-native';

const MOCK_TASKS = [
  { id: '1', title: 'Buy groceries', completed: false },
  { id: '2', title: 'Walk the dog', completed: true },
  { id: '3', title: 'Build a task app', completed: false },
  { id: '4', title: 'Learn React Native', completed: true },
];

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Tasks</Text>
      <FlatList
        data={MOCK_TASKS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskCard}>
            <View style={[styles.checkbox, item.completed && styles.checkboxDone]} />
            <Text style={[styles.taskTitle, item.completed && styles.taskTitleDone]}>
              {item.title}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#1a1a1a',
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#6c63ff',
    marginRight: 14,
  },
  checkboxDone: {
    backgroundColor: '#6c63ff',
    borderColor: '#6c63ff',
  },
  taskTitle: {
    fontSize: 16,
    color: '#1a1a1a',
  },
  taskTitleDone: {
    textDecorationLine: 'line-through',
    color: '#aaa',
  },
});
