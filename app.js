const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/database')
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./models/user');
const authenticateToken = require('./controllers/workspaceController')

const JWT_SECRET = "mahmoudSecret"
const app = express();
const PORT = process.env.PORT || 3006;


const workspaceRouter = require('./routes/workspace')
const userRouter = express.Router();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/user', userRouter);
app.use('/workspace', workspaceRouter);



sequelize
    // .sync({force: true})
    // .sync({ alter: true})
    .sync()
    .then(() => {
        console.log('Database Connected...');
        app.listen(PORT, () => {
            console.log(`Server is listening on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.log(`Database connection error ${error}`);
    });



userRouter.post('/register', [
    check('name').notEmpty().withMessage("name is required").isString().withMessage("name must be string"),
    check('email').isEmail().withMessage('Email must be valid'),
    check('password').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).withMessage('Password must be at least 8 characters, and must contain at least\n 1 Special character\n 1 capital letter\n 1 small letter\n 1 number'),
    check('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Password confirmation does not match passowrd');
        }
        return true;
    }),
], async (req, res) => {
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

userRouter.post('/login', [
    check('email').isEmail().withMessage('Email must be valid'),
    check('password').notEmpty().withMessage('Password cannot be empty. please, provide a correct password'),
], async (req, res) => {
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

