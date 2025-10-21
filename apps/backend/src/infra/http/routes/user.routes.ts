import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { RegisterUser } from 'domain/src/use-cases/RegisterUser';
import { AuthenticateUser } from 'domain/src/use-cases/AuthenticateUser';
import { InMemoryUserRepository } from '../../db/in-memory/InMemoryUserRepository';
import { BcryptPasswordService } from '../../../infra/services/BcryptPasswordService';

const router = Router();

// --- Dependencies ---
const userRepository = new InMemoryUserRepository();
const passwordService = new BcryptPasswordService();
const registerUserUseCase = new RegisterUser(userRepository, passwordService);
const authenticateUserUseCase = new AuthenticateUser(userRepository, passwordService);
const userController = new UserController(registerUserUseCase, authenticateUserUseCase);

// --- Routes ---
router.post('/register', (req, res) => userController.register(req, res));
router.post('/login', (req, res) => userController.login(req, res));

export default router;
