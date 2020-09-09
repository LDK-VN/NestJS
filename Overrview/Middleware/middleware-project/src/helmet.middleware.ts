import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

export function helmet(req: Request, res: Response, next: Function) {
  console.log('Request helmet...')
  next();
}
