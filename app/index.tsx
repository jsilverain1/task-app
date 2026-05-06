import { useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CreateTaskScreen from '../src/screens/CreateTaskScreen';
import { Task } from '../src/types';

const MOCK_TASKS: Task[] = [
  { id: '1', title: 'Buy groceries', completed: false },
  { id: '2', title: 'Walk the dog', completed: true },
  { id: '3', title: 'Build a task app', completed: false },
  { id: '4', title: 'Learn React Native', completed: true },
];

function EmptyState() {
  return (
    <View style={emptyStyles.container}>
      <Text style={emptyStyles.emoji}>📋</Text>
      <Text style={emptyStyles.title}>No tasks yet</Text>
      <Text style={emptyStyles.subtitle}>Tap the + button to add your first task</Text>
    </View>
  );
}

export default function HomeScreen() {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<{ id: string; title: string } | null>(null);

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

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const updateTask = (id: string, title: string) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, title } : task
    ));
    setTaskToEdit(null);
    setShowCreateTask(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Tasks</Text>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<EmptyState />}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.taskCard}
            onPress={() => toggleTask(item.id)}
          >
            <View style={[styles.checkbox, item.completed && styles.checkboxDone]} />
            <Text style={[styles.taskTitle, item.completed && styles.taskTitleDone]}>
              {item.title}
            </Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => {
                setTaskToEdit({ id: item.id, title: item.title });
                setShowCreateTask(true);
              }}
            >
              <Text style={styles.editButtonText}>✎</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteTask(item.id)}
            >
              <Text style={styles.deleteButtonText}>✕</Text>
            </TouchableOpacity>
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
    onCancel={() => {
      setShowCreateTask(false);
      setTaskToEdit(null);
    }}
    taskToEdit={taskToEdit}
    onUpdateTask={updateTask}
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
  deleteButton: {
    marginLeft: 'auto',
    padding: 6,
  },
  deleteButtonText: {
    color: '#ff4d4d',
    fontSize: 16,
    fontWeight: 'bold',
  },
  editButton: {
    marginLeft: 'auto',
    padding: 6,
  },
  editButtonText: {
    color: '#6c63ff',
    fontSize: 18,
  },
});

const emptyStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#aaa',
    textAlign: 'center',
  },
});