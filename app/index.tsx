import { useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CreateTaskScreen from '../src/screens/CreateTaskScreen';

const MOCK_TASKS = [
  { id: '1', title: 'Buy groceries', completed: false },
  { id: '2', title: 'Walk the dog', completed: true },
  { id: '3', title: 'Build a task app', completed: false },
  { id: '4', title: 'Learn React Native', completed: true },
];

export default function HomeScreen() {
  const [tasks, setTasks] = useState(MOCK_TASKS);
  const [showCreateTask, setShowCreateTask] = useState(false);

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const addTask = (title: string) => {
    const newTask = {
      id: Date.now().toString(),
      title,
      completed: false,
    };
    setTasks([newTask, ...tasks]);
    setShowCreateTask(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Tasks</Text>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.taskCard}
            onPress={() => toggleTask(item.id)}
          >
            <View style={[styles.checkbox, item.completed && styles.checkboxDone]} />
            <Text style={[styles.taskTitle, item.completed && styles.taskTitleDone]}>
              {item.title}
            </Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowCreateTask(true)}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <Modal
        visible={showCreateTask}
        transparent
        animationType="slide"
      >
        <CreateTaskScreen
          onAddTask={addTask}
          onCancel={() => setShowCreateTask(false)}
        />
      </Modal>
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
  fab: {
    position: 'absolute',
    bottom: 40,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#6c63ff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  fabText: {
    fontSize: 32,
    color: '#fff',
    lineHeight: 36,
  },
});
