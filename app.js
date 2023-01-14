const express = require('express');
const app = express();
require('dotenv').config();
require('express-async-errors');

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');


// extra packages & security
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const rateLimiter = require('express-rate-limit')

app.use(express.json())
app.set('trust proxy', 1)
app.use(rateLimiter({ windowMs: 15 * 60 * 1000, max: 100,}))
app.use(helmet())
app.use(cors())
app.use(xss())

// routes
let authRouter = require('./routes/auth')
let jobsRouter = require('./routes/jobs')

app.get('/', (req, res) => {
  res.send('jobs api');
});
const authMiddleWare = require('./middleware/authentication')
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/jobs', authMiddleWare, jobsRouter)

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// connect db & start server
const port = process.env.PORT || 5500;
const connectDB = require('./db/connect')
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
}

start();
