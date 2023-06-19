import express from 'express';
import "express-async-errors"; // needs to be imported before routers and other stuff!
import channelRouter from './routes/channel';
import message from './routes/message';
import messagesRouter from './routes/messages';
import userRouter from './routes/user';
import usersRouter from './routes/users';
import boardRoute from './routes/board';
import loginRouter from './routes/login';
import cookieParser from 'cookie-parser';
import boardRouter from './routes/board';

const app = express();

// Middleware:
app.use('*', express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// Routes
app.use(messagesRouter) // hier steht kein Pfad, das ist aber eine Ausnahme!

// ergänzen Sie hier ihre eigenen Router mit Pfad
app.use('/message', message)
app.use('/users', usersRouter)
app.use('/user', userRouter)
app.use('/channel', channelRouter)
app.use('/board', boardRouter)
app.use('/login', loginRouter)



export default app;