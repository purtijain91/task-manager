import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Check, Trash2, Plus, LogOut } from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const data = await api.getTasks();
      setTasks(data);
    } catch (err) {
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    setError('');

    if (!newTaskTitle.trim()) {
      setError('Title is required');
      return;
    }

    try {
      const newTask = await api.createTask(newTaskTitle);
      setTasks([...tasks, newTask]);
      setNewTaskTitle('');
    } catch (err) {
      setError('Failed to create task');
    }
  };

  const handleToggleTask = async (task) => {
    try {
      const updatedTask = await api.updateTask(task._id, {
        completed: !task.completed,
      });
      setTasks(tasks.map((t) => (t._id === task._id ? updatedTask : t)));
    } catch (err) {
      setError('Failed to update task');
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await api.deleteTask(id);
      setTasks(tasks.filter((t) => t._id !== id));
    } catch (err) {
      setError('Failed to delete task');
    }
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="container">
      <div className="task-header">
        <div>
          <h2>Task Manager</h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            Welcome back, {user?.email}
          </p>
        </div>
        <button onClick={logout} className="btn btn-danger">
          <LogOut size={18} />
          Logout
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="glass-panel" style={{ padding: '2rem' }}>
        <form onSubmit={handleAddTask} className="task-form">
          <input
            type="text"
            className="form-input"
            placeholder="What needs to be done?"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">
            <Plus size={20} />
            Add
          </button>
        </form>

        <div className="task-list">
          {tasks.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>
              No tasks yet. Add one above!
            </p>
          ) : (
            tasks.map((task) => (
              <div key={task._id} className="task-item">
                <div className="task-content" onClick={() => handleToggleTask(task)}>
                  <div className={`task-checkbox ${task.completed ? 'checked' : ''}`}>
                    {task.completed && <Check size={14} color="white" />}
                  </div>
                  <span className={`task-text ${task.completed ? 'completed' : ''}`}>
                    {task.title}
                  </span>
                </div>
                <button
                  onClick={() => handleDeleteTask(task._id)}
                  className="btn btn-danger"
                  aria-label="Delete task"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
