const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../../app/models/user'); //Para acoes de login e cadastro
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const mailer = require('../../modules/mailer');


const authConfig = require('../../config/auth');

const router = express.Router();


function generateToken(params = {}) {
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400,
    });
}

router.post('/register', async (req, res) =>{
const { email } = req.body;

    try{
        if(await User.findOne({ email }))
            return res.status(400).send({ error: 'User already exists'});


        const user = await User.create(req.body); //todos os parametros ficam em req.body ,await serve que para continuar tao metodo precisar terminar

        user.password = undefined;

        return res.send({ 
            user, 
            token: generateToken({ id: user.id }), //assim que criar usuario, ja passa o token do ususario para logar automaticamnete
        });
    } catch (err) {
        return res.status(400).send({ error: 'Registation failed'});
    }
});

router.post('/authenticate', async(req, res) => {
    const { email, password } = req.body;

    //busca email e password do usuario de acordo com email e traz a senha
    const user = await User.findOne({ email }).select('+password'); //preciso do password na autenticação, logo select adiciona esse campo

    if(!user)
        return res.status(400).send({ error: 'User not found' });

    //verifica se a senha e correta(senha esta criptografada)
    if(!await bcrypt.compare(password, user.password))
        return res.status(400).send({ error: 'Invalid Password' });

    user.password = undefined;

    res.send({ 
        user, 
        token: generateToken({ id: user.id }),
     });
});

router.post('/forgot_password', async(req, res) =>{
    const { email } = req.body;

    try{
        const user = await User.findOne({ email }); //procura usuario com este email

        if(!user)
            return res.status(400).send({ error: 'User not found' });

        //gerar token
        const token = crypto.randomBytes(20).toString('hex');
        //tempo de expiração
        const now = new Date();
        now.setHours(now.getHours() + 1);

    
        await User.findByIdAndUpdate(user.id, {
            '$set': {
            passwordResetToken: token,
            passwordResetExpires: now,
            }
            }, { new: true, useFindAndModify: false }
            );

            await mailer.sendMail({
                to: email,
                from: 'lucasrochaneedforspeed@gmail.com',
                subject: 'Test',
                template: 'forgot_password',
                context: { token },
            }, (err) => {
                if(err)
                    return res.status(400).send({ error: 'Cannot send forgot password email' });
                
                    return res.send(); //retorna cod:200ok
            })
    }catch(err){
        console.log(err);
        res.status(400).send({ error: 'Error on forgot password, try again' });
    }


});

router.post('/reset_password', async(req, res) => {
    const { email, token, password }  = req.body;

    try{
        const user = await User.findOne({ email }) //procura usuario com este email
            .select('+passwordResetToken passwordResetExpires');

            if(!user)
                return res.status(400).send({ error: 'User not found' });

            if(token !== user.passwordResetToken)
                return res.status(400).send({ error: 'Token Invalid' });

            const now = new Date();

            if(now > user.passwordResetExpires)
                return res.status(400).send({ error: 'Token Expired, generate a new one' });

            user.password = password;

            await user.save();
            res.send();


    } catch(err){
        res.status(400).send({ error: 'Cannot reset password, try again' });
    }
});

//todas as rotas definidas, vao ser prefixadas com /auth 
module.exports = app => app.use('/auth', router);