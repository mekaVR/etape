import { Request } from 'express';

export interface JwtTokenPayload {
    sub: number;
    email: string;
}

export interface AuthenticatedRequest extends Request {
    user: {
        id: number;
        email: string;
    };
}
