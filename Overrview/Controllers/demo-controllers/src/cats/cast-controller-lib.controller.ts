import { Controller, Post, Res, HttpStatus, Get } from '@nestjs/common';
import { Response } from 'express';

@Controller('castssss')
export class CastControllerLibController {
    @Post()
    create(@Res() res: Response) {
        res.status(HttpStatus.CREATED).send('okie');
    }

    @Get()
    findAll(@Res() res: Response) {
        res.status(HttpStatus.OK).json(['okie1','okie2']);
    }
}
