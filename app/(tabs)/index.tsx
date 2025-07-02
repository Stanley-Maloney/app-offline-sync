import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import React, { useEffect, useState } from 'react';
import {
  Button,
  FlatList,
  SafeAreaView, StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

const remoteTasks = [
  { id: '1', text: 'Tarefa do servidor 1', completed: false, synced: true },
  { id: '2', text: 'Tarefa do servidor 2', completed: false, synced: true },
];

export default function Index() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    loadTasks();

const unsubscribe = NetInfo.addEventListener(state => {
  setIsConnected(state.isConnected ?? true);
});

    return () => unsubscribe();
  }, []);

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      if (storedTasks !== null) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
    }
  };

  const saveTasks = async (updatedTasks) => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
    } catch (error) {
      console.error('Erro ao salvar tarefas:', error);
    }
  };

  const addTask = () => {
    if (newTask.trim() === '') return;

    const task = {
      id: Date.now().toString(),
      text: newTask,
      completed: false,
      synced: false,
      createdAt: new Date().toISOString()
    };

    const updatedTasks = [...tasks, task];
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    setNewTask('');

    addToSyncQueue({ type: 'CREATE', data: task });

    if (isConnected) {
      syncTasks();
    }
  };

  const toggleTaskCompletion = (id) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === id) {
        const updatedTask = {
          ...task,
          completed: !task.completed,
          synced: false
        };

        addToSyncQueue({ type: 'UPDATE', data: updatedTask });
        return updatedTask;
      }
      return task;
    });

    setTasks(updatedTasks);
    saveTasks(updatedTasks);

    if (isConnected) {
      syncTasks();
    }
  };

  const addToSyncQueue = async (operation) => {
    try {
      const queueJSON = await AsyncStorage.getItem('syncQueue');
      let queue = queueJSON ? JSON.parse(queueJSON) : [];

      queue.push({
        ...operation,
        timestamp: Date.now()
      });

      await AsyncStorage.setItem('syncQueue', JSON.stringify(queue));
    } catch (error) {
      console.error('Erro ao adicionar à fila de sincronização:', error);
    }
  };

  const syncTasks = async () => {
    try {
      const queueJSON = await AsyncStorage.getItem('syncQueue');
      if (!queueJSON) return;

      const queue = JSON.parse(queueJSON);
      if (queue.length === 0) return;

      console.log('Sincronizando tarefas...', queue);

      const processedQueue = [];
      const updatedTasks = tasks.map(task => ({
        ...task,
        synced: true
      }));

      setTasks(updatedTasks);
      saveTasks(updatedTasks);
      await AsyncStorage.setItem('syncQueue', JSON.stringify(processedQueue));

      console.log('Sincronização concluída!');
    } catch (error) {
      console.error('Erro ao sincronizar tarefas:', error);
    }
  };

  const restaurarDadosOriginais = async () => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(remoteTasks));
      await AsyncStorage.setItem('syncQueue', JSON.stringify([]));
      setTasks(remoteTasks);
      console.log('Dados restaurados com sucesso!');
    } catch (error) {
      console.error('Erro ao restaurar dados:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Lista de Tarefas</Text>
      <Text style={[styles.connectionStatus, isConnected ? styles.online : styles.offline]}>
        {isConnected ? '🟢 Online' : '🔴 Offline'}
      </Text>

      {isConnected && (
        <Button title="Sincronizar Agora" onPress={syncTasks} />
      )}

      <View style={{ marginVertical: 10 }}>
        <Button title="Restaurar Dados Originais" color="red" onPress={restaurarDadosOriginais} />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newTask}
          onChangeText={setNewTask}
          placeholder="Nova tarefa"
        />
        <Button title="Adicionar" onPress={addTask} />
      </View>

      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <Text
              style={[
                styles.taskText,
                item.completed && styles.taskCompleted
              ]}
              onPress={() => toggleTaskCompletion(item.id)}
            >
              {item.text}
            </Text>
            {!item.synced && <Text style={styles.syncIndicator}>●</Text>}
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  connectionStatus: {
    marginBottom: 10,
    fontWeight: '500',
  },
  online: {
    color: 'green',
  },
  offline: {
    color: 'red',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginRight: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  taskItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
  },
  taskText: {
    flex: 1,
    fontSize: 16,
  },
  taskCompleted: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  syncIndicator: {
    color: 'orange',
    fontSize: 12,
    marginLeft: 10,
  },
});
