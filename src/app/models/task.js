const mongoose = require('../../database');
const bcrypt = require('bcryptjs');

//Como se fossse os campos dentro do BD
const TaskSchema = new mongoose.Schema({
    title: {
        type: String, //nome
        require: true,
    },

    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'project',
        require: true,
    },

    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true,
    },

    completed: {
        type: Boolean,
        require: true,
        default: false,
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true,
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Task = mongoose.model('task', TaskSchema); //nome do modulo, e o schema usado

module.exports = Task;