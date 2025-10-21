import { IPasswordService } from 'domain/src/services/IPasswordService';
import * as bcrypt from 'bcrypt';

export class BcryptPasswordService implements IPasswordService {
  constructor(private readonly saltRounds: number = 10) {}

  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
