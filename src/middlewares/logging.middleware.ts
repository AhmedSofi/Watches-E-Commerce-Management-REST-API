import {injectable} from '@loopback/core';
import {Request, Response, NextFunction} from 'express';

// Define the type for middleware
export type Middleware = (req: Request, res: Response, next: NextFunction) => void;

@injectable()
export class LoggingMiddlewareProvider {
  // Provide the middleware function
  value(): Middleware {
    return (req: Request, res: Response, next: NextFunction) => {
      console.log(`Request: ${req.method} ${req.url}`);

      res.on('finish', () => {
        console.log(`Response: ${res.statusCode}`);
      });

      next();
    };
  }
}
