import { Router } from 'express';
import { BookController } from '../controllers/BookController';
import { AddBook } from 'domain/src/use-cases/AddBook';
import { UpdateBookDetails } from 'domain/src/use-cases/UpdateBookDetails';
import { RemoveBook } from 'domain/src/use-cases/RemoveBook';
import { InMemoryBookRepository } from '../../db/in-memory/InMemoryBookRepository';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// --- Dependencies ---
const bookRepository = new InMemoryBookRepository();
const addBookUseCase = new AddBook(bookRepository);
const updateBookDetailsUseCase = new UpdateBookDetails(bookRepository);
const removeBookUseCase = new RemoveBook(bookRepository);
const bookController = new BookController(addBookUseCase, updateBookDetailsUseCase, removeBookUseCase);

// --- Routes ---
router.use(authMiddleware); // Todas las rutas de libros requieren autenticación

router.post('/', (req, res) => bookController.create(req, res));
router.put('/:id', (req, res) => bookController.update(req, res));
router.delete('/:id', (req, res) => bookController.delete(req, res));

export default router;
