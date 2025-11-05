import { Router } from 'express';
import { LoanController } from '../controllers/LoanController';
import { LoanBook } from 'domain/src/use-cases/LoanBook';
import { ReturnBook } from 'domain/src/use-cases/ReturnBook';
import { GetUserLoans } from 'domain/src/use-cases/GetUserLoans';
import { InMemoryLoanRepository } from '../../db/in-memory/InMemoryLoanRepository';
import { InMemoryBookRepository } from '../../db/in-memory/InMemoryBookRepository';
import { InMemoryUserRepository } from '../../db/in-memory/InMemoryUserRepository';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// --- Dependencies ---
const loanRepository = new InMemoryLoanRepository();
const bookRepository = new InMemoryBookRepository();
const userRepository = new InMemoryUserRepository();

const loanBookUseCase = new LoanBook(userRepository, bookRepository, loanRepository);
const returnBookUseCase = new ReturnBook(loanRepository, bookRepository);
const getUserLoansUseCase = new GetUserLoans(loanRepository, bookRepository, userRepository);
const loanController = new LoanController(loanBookUseCase, returnBookUseCase, getUserLoansUseCase);

// --- Routes ---
router.use(authMiddleware);

router.post('/', (req, res) => loanController.create(req, res));
router.put('/:id/return', (req, res) => loanController.return(req, res));
router.get('/my-loans', (req, res) => loanController.myLoans(req, res));

export default router;
