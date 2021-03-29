require('dotenv').config();

const express = require('express');
const { addAsync } = require('@awaitjs/express');

const mongoose = require('mongoose');

const userRouter = require('./routers/userRouter');
const tokenRouter = require('./routers/tokenRouter');
const jwtMiddleware = require('./middleware/jwt');
const errorHandler = require('./middleware/errorHandler');

const app = addAsync(express());

app.use(express.json());
app.useAsync(jwtMiddleware);
app.use('/tokens', tokenRouter);
app.use('/users', userRouter);
app.use(errorHandler);

(async () => {
  await mongoose.connect(process.env.DATABASE_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });
  app.listen(8000);
})();
