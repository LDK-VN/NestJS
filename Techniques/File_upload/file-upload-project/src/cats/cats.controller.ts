import { Controller, Post, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { AnyFilesInterceptor, FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@Controller('cats')
export class CatsController {
    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    uploadFile(@UploadedFile() file) {
        console.log(file);
    }

    @Post('uploads')
    @UseInterceptors(FilesInterceptor('files'))
    uploadFiles(@UploadedFiles() files) {
        console.log(files);
    }

    @Post('uploadss')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'avatar', maxCount: 1 },
        { name: 'background', maxCount: 1}
    ]))
    uploadFiless(@UploadedFiles() files) {
        console.log(files);
    }

    @Post('uploadAny')
    @UseInterceptors(AnyFilesInterceptor())
    uploadAnyFile(@UploadedFiles() files) {
        console.log(files);
    }
}


