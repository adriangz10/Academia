import { Request, Response } from 'express';
import { RegisterUser } from 'domain/src/use-cases/RegisterUser';
import { AuthenticateUser } from 'domain/src/use-cases/AuthenticateUser';
import * as jwt from 'jsonwebtoken';

export class UserController {
  constructor(
    private readonly registerUser: RegisterUser,
    private readonly authenticateUser: AuthenticateUser
  ) {}

  async register(req: Request, res: Response): Promise<Response> {
    try {
      const { name, email, password } = req.body;
      const user = await this.registerUser.execute({ name, email, password });
      return res.status(201).json({ id: user.id, name: user.name, email: user.email, role: user.role });
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  async login(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body;
      const user = await this.authenticateUser.execute({ email, password });

      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '1h' }
      );

      return res.status(200).json({ token });
    } catch (error: any) {
      return res.status(401).json({ message: error.message });
    }
  }
}
