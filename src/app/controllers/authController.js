const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth.json');
const crypto = require('crypto');
const mailer = require('../../modules/miler');
const User = require('../models/user');

const Router = express.Router()


function generateToken(params = {}) {
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400,
    });
}

Router.post('/cadastro', async (req, res) => {
    const { email } = req.body;
    try {

        if (await User.findOne({ email }))
            return res.status(400).send({ error: 'Email existe' });

        const user = await User.create(req.body);
        console.log(user);
        user.password = undefined;

        return res.send({
            user: [user],
            token: generateToken({ id: user.id }),
        });


    } catch (err) {
        return res.status(400).send({ err: 'Falha ao registrar' })
    }

})

Router.post('/authenticate', async (req, res) => {
    const { email, password } = req.body;
    try {

        const user = await User.findOne({ email }).select('+password')

        if (!user)
            return res.status(400).send({ erro: 'Usuario não existe' });

        if (!await bcrypt.compare(password, user.password))
            return res.status(400).send({ error: 'Senha invalida' });

        user.password = undefined;


        return res.send({
            user,
            token: generateToken({ id: user.id }),

        });
    } catch (err) {
        return res.status(400).send({ err: 'Falha ao authenticate' })
    }


})

Router.post('/forgot_password', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user)
            return res.status(400).send({ error: "usuario não exite" })

        const token = crypto.randomBytes(20).toString('hex');
        const now = new Date();
        now.setHours(now.getHours() + 1);

        await User.findByIdAndUpdate(user.id, {
            '$set': {
                passwordResetToken: token,
                passwordResetExpires: now
            }


        });

        mailer.sendMail({
            to: email,
            from: 'diorgecoelho@gmail.com',
            template: 'auth/forgot_password',
            context: { token },


        }, (err) => {
            if (err)
                return res.status(400).send({ error: 'não é possível enviar esqueci a senha' });
        })

        res.send()


    } catch (err) {
        console.log(err)
        res.status(400).send({ erro: " erro on forgot password, try again " })
    }
});

Router.post('/reset_password', async (req, res) => {
    const { email, token, password } = req.body;

    try {
        const user = await User.findOne({ email })
            .select('+passwordResetToken passwordResetExpires');

        if (!user) return res.status(400).send({ error: 'usuario não existe' });

        if (token !== user.passwordResetToken) return res.status(400).send({ error: 'token invalido' });

        const now = new Date();

        if (now > user.passwordResetExpires) return res.status(400).send({ error: " token expirou, gere outo token!" });

        user.password = password;
        await user.save();

        return res.send({ ok: 'senha alterada com sucesso!' })

    } catch (err) {
        console.log(err)
        res.status(400).send({ error: 'cannot reset passoword, try again' });

    }
});

module.exports = app => app.use('/auth', Router);