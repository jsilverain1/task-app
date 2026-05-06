import { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { UpdateTaskInput } from '../types';

type Props = {
  onAddTask: (title: string) => void;
  onCancel: () => void;
  taskToEdit?: UpdateTaskInput| null;
  onUpdateTask?: (id: string, title: string) => void;
};

export default function CreateTaskScreen({ onAddTask, onCancel, taskToEdit, onUpdateTask }: Props) {
  const [title, setTitle] = useState(taskToEdit ? taskToEdit.title : '');

  const handleSubmit = () => {
    if (title.trim() === '') return;
    if (taskToEdit && onUpdateTask) {
      onUpdateTask(taskToEdit.id, title.trim());
    } else {
      onAddTask(title.trim());
    }
    setTitle('');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.card}>
        <Text style={styles.header}>{taskToEdit ? 'Edit Task' : 'New Task'}</Text>

        <TextInput
          style={styles.input}
          placeholder="What needs to be done?"
          placeholderTextColor="#aaa"
          value={title}
          onChangeText={setTitle}
          autoFocus
        />

        <TouchableOpacity
          style={[styles.button, styles.addButton]}
          onPress={handleSubmit}
        >
          <Text style={styles.addButtonText}>{taskToEdit ? 'Update Task' : 'Add Task'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={onCancel}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  card: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1a1a1a',
    marginBottom: 16,
  },
  button: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: '#6c63ff',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
  },
  cancelButtonText: {
    color: '#1a1a1a',
    fontSize: 16,
  },
});