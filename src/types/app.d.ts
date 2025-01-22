import { UUID } from 'crypto';
import { Role } from 'src/common/Enums';

interface JwtUser {
  id: UUID;
  username: string;
  role: Role;
  iat: number;
  exp: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtUser;
    }
  }
}
