const Task = require('../models/Task');

const getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ userId: req.user.id });
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

const createTask = async (req, res, next) => {
  try {
    if (!req.body.title) {
      res.status(400);
      throw new Error('Please add a title field');
    }

    const task = await Task.create({
      title: req.body.title,
      completed: req.body.completed || false,
      userId: req.user.id,
    });

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    // Check for user
    if (!req.user) {
      res.status(401);
      throw new Error('User not found');
    }

    // Make sure the logged in user matches the task user
    if (task.userId.toString() !== req.user.id) {
      res.status(401);
      throw new Error('User not authorized');
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedTask);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    // Check for user
    if (!req.user) {
      res.status(401);
      throw new Error('User not found');
    }

    // Make sure the logged in user matches the task user
    if (task.userId.toString() !== req.user.id) {
      res.status(401);
      throw new Error('User not authorized');
    }

    await Task.findByIdAndDelete(req.params.id);

    res.status(200).json({ id: req.params.id });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};
