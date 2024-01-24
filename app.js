const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/database')


const app = express();
const PORT = process.env.PORT || 3007;


const workspaceRouter = require('./routes/workspace')
const userRouter = require('./routes/user')
const spaceRouter = require('./routes/space')
const listRouter = require('./routes/list')



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use('/user', userRouter);
app.use('/workspace', workspaceRouter);
app.use('/space', spaceRouter);
app.use('/list', listRouter);



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



