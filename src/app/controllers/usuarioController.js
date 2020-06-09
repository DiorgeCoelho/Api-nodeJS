const express = require('express');
const authMiddllewares = require('../middlewares/auth');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/user');

const Router = express.Router();

Router.use(authMiddllewares)

Router.get('/:Id', async (req, res) => {
        try {
                const user = await User.findById(req.params.Id);
                return res.json(user);
        } catch (err) {
                return res.status(400).send({ error: 'error ao buscar Usuario' });
        }
});
Router.put('/:Id', async (req, res) => {
        try {
                const { name, password } = req.body;
                let hash = await bcrypt.hash(password, 10);
                const user = await User.findById(req.params.Id)
                if (!user) {
                        res.send(400).send({ error: "usuario não existe" });
                }


                await User.findByIdAndUpdate(user.id, {
                        name: name,
                        password: hash
                });
                return res.send();

        } catch (err) {
                console.log(err)
                return res.status(400).send({ error: 'Error update  new Usuario' });
        }
});
module.exports = app => app.use('/usuario', Router);