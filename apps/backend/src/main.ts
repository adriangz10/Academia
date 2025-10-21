import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import userRoutes from './infra/http/routes/user.routes';
import bookRoutes from './infra/http/routes/book.routes';
import loanRoutes from './infra/http/routes/loan.routes';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/users', userRoutes);
app.use('/books', bookRoutes);
app.use('/loans', loanRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
