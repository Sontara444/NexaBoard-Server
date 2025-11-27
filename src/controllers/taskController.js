const asyncHandler = require('express-async-handler');
const Task = require('../models/Task');


const getTasks = asyncHandler(async (req, res) => {
    const tasks = await Task.find({ user: req.user._id });
    res.json(tasks);
});


const createTask = asyncHandler(async (req, res) => {
    const { title, description, status, priority, dueDate } = req.body;

    if (!title) {
        res.status(400);
        throw new Error('Please add a title');
    }

    const task = await Task.create({
        user: req.user._id,
        title,
        description,
        status,
        priority,
        dueDate,
    });

    res.status(201).json(task);
});


const updateTask = asyncHandler(async (req, res) => {
    const task = await Task.findById(req.params.id);

    if (!task) {
        res.status(404);
        throw new Error('Task not found');
    }

    if (!req.user) {
        res.status(401);
        throw new Error('User not found');
    }

    if (task.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });

    res.json(updatedTask);
});


const deleteTask = asyncHandler(async (req, res) => {
    const task = await Task.findById(req.params.id);

    if (!task) {
        res.status(404);
        throw new Error('Task not found');
    }

    if (!req.user) {
        res.status(401);
        throw new Error('User not found');
    }

    if (task.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    await task.deleteOne();

    res.json({ id: req.params.id });
});

module.exports = {
    getTasks,
    createTask,
    updateTask,
    deleteTask,
};
