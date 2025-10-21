import { Router } from 'express';
import { LoanController } from '../controllers/LoanController';
import { LoanBook } from 'domain/src/use-cases/LoanBook';
import { ReturnBook } from 'domain/src/use-cases/ReturnBook';
import { InMemoryLoanRepository } from '../../db/in-memory/InMemoryLoanRepository';
import { InMemoryBookRepository } from '../../db/in-memory/InMemoryBookRepository';
import { InMemoryUserRepository } from '../../db/in-memory/InMemoryUserRepository';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// --- Dependencies ---
// NOTA: En una app real, estos repositorios serían singletons.
// Aquí los instanciamos de nuevo, pero apuntan a la misma "base de datos" en memoria.
const loanRepository = new InMemoryLoanRepository();
const bookRepository = new InMemoryBookRepository();
const userRepository = new InMemoryUserRepository();

const loanBookUseCase = new LoanBook(userRepository, bookRepository, loanRepository);
const returnBookUseCase = new ReturnBook(loanRepository, bookRepository);
const loanController = new LoanController(loanBookUseCase, returnBookUseCase);

// --- Routes ---
router.use(authMiddleware); // Todas las rutas de préstamos requieren autenticación

router.post('/', (req, res) => loanController.create(req, res));
router.put('/:id/return', (req, res) => loanController.return(req, res));

export default router;
