import { Request } from 'express';

export interface JwtTokenPayload {
  sub: number;
  email: string;
  username: string;
  role: string;
}

export interface AuthenticatedRequest extends Request {
  user: {
    id: number;
    email: string;
    username: string;
    role: string;
  };
}
