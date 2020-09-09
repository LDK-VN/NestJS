import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

export function cors (req: Request, res: Response, next: Function) {
  console.log('Request cors...');
  next();
}
