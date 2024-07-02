import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import userRouter from './routes/users.js';
import skuRouter from './routes/skus.js';

const app = express();
const PORT = 3000;

const mongoUrl = process.env.MONGO_URL || 'mongodb://mongo:27017/vtex';

mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(cors());
app.use(express.json());
app.use('/users', userRouter);
app.use('/skus', skuRouter);
app.get('/teste',(req,res)=>res.send('ALOALOGALERINHA'))


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
