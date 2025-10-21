import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { User, UserRole } from 'domain/src/entities/User';

// Extender la interfaz Request de Express para incluir el objeto user
// Esto es para que TypeScript no se queje cuando añadamos req.user
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication token is missing or invalid.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { id: string; role: UserRole };
    
    // Creamos un objeto usuario "parcial" para pasarlo a los casos de uso.
    // No tenemos toda la info del usuario, pero sí la necesaria para la autorización (id y rol).
    req.user = { id: decoded.id, role: decoded.role } as User;

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};
