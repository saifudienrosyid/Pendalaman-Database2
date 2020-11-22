import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import morgan from 'morgan'

import firebaseRouter from './routes/route'

const PORT = process.env.PORT || 3000
const app = express()

app.use(express.json())
app.use(morgan('dev'))
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.status(500).json({
      success: false,
      message: err.message
    });
});

app.get('/', async (req, res, next) => {
    res.json({message: 'success'});
})

app.use('/fb',firebaseRouter)


app.listen(PORT, () => {
  console.log(`App is listening to port ${PORT}`);
});
