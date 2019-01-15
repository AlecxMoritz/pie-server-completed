const router = require('express').Router();
const User = require('../db').import('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// sign up
router.post('/signup', (req, res) => {
    User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10)
    })
    .then(
        createSuccess = user => {
            let token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 });

            res.json({
                user: user,
                message: 'User created',
                sessionToken: token
            })
        },

        createError = err => res.status(500).json({ error: err })
    )
})

// sign in
router.post('/signin', (req, res) => {
    User.findOne({ where: { email: req.body.email } })
        .then(user => {
            if(user) {
                bcrypt.compare(req.body.password, user.password, (err, matches) => {
                    if(matches) {
                        let token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 });

                        res.json({
                            user: user,
                            message: 'Signed In',
                            sessionToken: token
                        })
                    } else {
                        res.status(502).json({ error: 'Email or password invalid.' });
                    }
                })
            } else {
                res.status(404).json({ error: 'User not found' })
            }
        }, 
            err => res.status(500).json({ error: 'Internal Error' })
        )   
})

module.exports = router;