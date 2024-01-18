const { check } = require('express-validator');

exports.validateRegister = [
    check('name').notEmpty().withMessage("name is required").isString().withMessage("name must be string"),
    check('email').isEmail().withMessage('Email must be valid'),
    check('password').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).withMessage('Password must be at least 8 characters, and must contain at least\n 1 Special character\n 1 capital letter\n 1 small letter\n 1 number'),
    check('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Password confirmation does not match passowrd');
        }
        return true;
    }),
];


exports.validateLogin = [
    check('email').isEmail().withMessage('Email must be valid'),
    check('password').notEmpty().withMessage('Password cannot be empty. please, provide a correct password'),
];

