const mongoose = require('../../database');
const bcrypt = require('bcryptjs');

//Como se fossse os campos dentro do BD
const UserSchema = new mongoose.Schema({
    name: {
        type: String, 
        require: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        select: false, //na busca, as senhas nao sao capturadas
    },

    passwordResetToken: {
        type: String,
        select: false,
    },

    passwordResetExpires: {
        type: Date,
        select: false,
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },

});

UserSchema.pre('save', async function(next){//funcao pre que indica que acontece alguma coisa antes de salvar

    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash; //this se refere ao objeto salvo

    next();
}); 
const User = mongoose.model('user', UserSchema); //nome do modulo, e o schema usado

module.exports = User;