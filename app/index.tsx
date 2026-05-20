import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CreateTaskScreen from '../src/screens/CreateTaskScreen';
import * as taskService from '../src/services/taskService';
import * as tokenService from '../src/services/tokenService';
import { Task, UpdateTaskInput } from '../src/types';

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
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<UpdateTaskInput | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    loadTasks();
  }, []);

  const getToken = async () => {
    const token = await tokenService.getToken();
    if (!token) {
      router.replace('/login');
      return null;
    }
    return token;
  };

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError('');
      const token = await getToken();
      if (!token) return;
      const data = await taskService.getTasks({ token });
      setTasks(data);
    } catch (err) {
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = async (id: string, completed: boolean) => {
    try {
      const token = await getToken();
      if (!token) return;
      const updated = await taskService.toggleTask(id, !completed, { token });
      setTasks(tasks.map(task =>
        task.id === id ? { ...task, completed: updated.completed } : task
      ));
    } catch (err) {
      setError('Failed to update task');
    }
  };

  const addTask = async (title: string) => {
    try {
      const token = await getToken();
      if (!token) return;
      const newTask = await taskService.createTask({ title }, { token });
      setTasks([newTask, ...tasks]);
      setShowCreateTask(false);
    } catch (err) {
      setError('Failed to create task');
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const token = await getToken();
      if (!token) return;
      await taskService.deleteTask(id, { token });
      setTasks(tasks.filter(task => task.id !== id));
    } catch (err) {
      setError('Failed to delete task');
    }
  };

  const updateTask = async (id: string, title: string) => {
    try {
      const token = await getToken();
      if (!token) return;
      const updated = await taskService.updateTask({ id, title }, { token });
      setTasks(tasks.map(task =>
        task.id === id ? { ...task, title: updated.title } : task
      ));
      setTaskToEdit(null);
      setShowCreateTask(false);
    } catch (err) {
      setError('Failed to update task');
    }
  };

  const handleLogout = async () => {
    await tokenService.deleteToken();
    router.replace('/login');
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6c63ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>My Tasks</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {error !== '' && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<EmptyState />}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.taskCard}
            onPress={() => toggleTask(item.id, item.completed)}
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  logoutText: {
    color: '#6c63ff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  errorBox: {
    backgroundColor: '#ffe5e5',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#cc0000',
    fontSize: 14,
    textAlign: 'center',
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
    flex: 1,
  },
  taskTitleDone: {
    textDecorationLine: 'line-through',
    color: '#aaa',
  },
  editButton: {
    marginLeft: 'auto',
    padding: 6,
  },
  editButtonText: {
    color: '#6c63ff',
    fontSize: 18,
  },
  deleteButton: {
    padding: 6,
  },
  deleteButtonText: {
    color: '#ff4d4d',
    fontSize: 16,
    fontWeight: 'bold',
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