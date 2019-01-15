const jwt = require('jsonwebtoken');
const User = require('../db').import('../models/user');

const validateSession = (req, res, next) => {
    const token = req.headers.authorization;

    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
        if(!err && decodedToken) {
            User.findOne({ where: { id: decodedToken.id }})
                .then(user => {
                    if(!user) {
                        res.status(401).json({ message: "You are not authorized for this action." })
                    }

                    req.user = user;
                    return next();
                })
                .catch(err => res.status(500).json({ error: err }))
        } else {
            res.status(401).json({ error: "Unauthorized" })
        }
    })
};

module.exports = validateSession;