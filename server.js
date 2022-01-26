// middleware
const { notFound, errorHandler } = require('./middlewares/errorMiddleware')

// env
const dotenv = require('dotenv')

// path
const path = require('path')

//Express + cors
const express = require('express');
const app = express();
const cors = require('cors');

// env
dotenv.config();

//app uses
app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//mongoose + mongodb 
const mongoose = require('mongoose');

// user (auth)
app.use('/api/users', require('./routes/userRoutes'));

// welcome at localhost port
// app.get('/', (req, res) => {
//     res.send('welcome')
// })

app.use(express.static(path.join(__dirname, '/frontend/build')))
app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, '/frontend/build/index.html'))
)

// middleware
app.use(notFound);
app.use(errorHandler);

// mongoose connect
mongoose.connect('mongodb://localhost/Movies', { useNewUrlParser: true, useUnifiedTopology: true }, () => {
    console.log('Connected to DB');
});

// port
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Listening to port http://localhost:${PORT}`))