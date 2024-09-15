import {Next} from '@loopback/core';
import {Middleware, MiddlewareContext} from '@loopback/express';
import {NextFunction} from 'express';
import rateLimit from 'express-rate-limit';

// Define rate limiting rules
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

export class RateLimiterMiddlewareProvider {
  value() {
    return async (ctx: MiddlewareContext, next: Next) => {
      const {request, response} = ctx;

      // Apply rate limiting only to specific endpoints
      if (request.url === '/getWatches' || request.url === '//addWatches') {
        return limiter(request, response, next);
      }

      // If not applying rate limiting, simply continue to the next middleware
      return next();
    };
  }
}
