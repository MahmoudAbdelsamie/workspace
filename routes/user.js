const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const userValidation =  require('../validations/userValidation');
const User = require('../models/user');

const JWT_SECRET = "mahmoudSecret";

const router = express.Router();

router.post('/register', userValidation.validateRegister, async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ status_code: 400, message: 'Bad Request', errors: errors.array() });
    }
    try {
        const { name, email, password } = req.body;
        await bcrypt.hash(password, 10).then(async (hashedPassword) => {
            const user = User.create({ name, email, password: hashedPassword });
            // await user.save();
            res.status(201).json({
                status_code: 201,
                message: 'Registeration successful',
                data: { user_id: user.id, user_email: user.email },
            });
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({ status_code: 501, message: error.message, data: null });
    }
});

router.post('/login', userValidation.validateLogin,  async (req, res) => {
    const errors = validationResult(req);
  
    if (!errors.isEmpty()) {
      return res.status(400).json({ status_code: 400, message: 'Bad Request', errors: errors.array() });
    }
  
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email } });
  
      if (!user) {
        return res.status(401).json({ status_code: 401, message: 'Invalid credentials' });
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      if (!isPasswordValid) {
        return res.status(401).json({ status_code: 401, message: 'Invalid credentials' });
      }
  
      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
      res.status(200).json({
        status_code: 200,
        message: 'Login successful',
        data: { user_id: user.id, user_email: user.email, user_token: token },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ status_code: 500, message: 'Server Error' });
    }
});

module.exports = router;
