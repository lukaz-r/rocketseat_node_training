const mongoose = require('../../database');
const bcrypt = require('bcryptjs');

//Como se fossse os campos dentro do BD
const ProjectSchema = new mongoose.Schema({
    title: {
        type: String, //nome
        require: true,
    },
    description: {
        type: String,
        require: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        require: true,
    },
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'task',
    }],

    createdAt: {
        type: Date,
        default: Date.now,
    },

});

const Project = mongoose.model('project', ProjectSchema); //nome do modulo, e o schema usado

module.exports = Project;