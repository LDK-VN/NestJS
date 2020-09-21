# File upload (Tải lên tệp)

Cung cấp module dựa trên [multer](https://github.com/expressjs/multer) -> Xử lý data ở dạng **multipart/form-data**.


## Basic example (Ví dụ cơ bản)

Dùng **FileInterceptor()** interceptor với router handler, trích xuất file từ **request** sử dụng **@UploadedFile()** decorator.

```ts
@Post('upload')
@UseInterceptors(FileInterceptor('file'))
uploadFile(@UploadedFile() file) {
  console.log(file);
}
```

**FileInterceptor()** decorator nhận 2 arguments:

* **fieldName**: chuỗi cung cấp tên của trường từ biểu mẫu HTML chứa tệp
* **options**: đối tượng tùy chọn của loại MulterOptions. Đây là đối tượng tương tự được sử dụng bởi phương thức tạo multer (chi tiết hơn [tại đây](https://github.com/expressjs/multer#multeropts))

## Array of files (Mảng tệp)

Sử dụng **FilesInterceptor()** decorator

Cần 3 đối số

* **fieldName**: như đã mô tả ở trên
* **maxCount**: số tùy chọn xác định số lượng tệp tối đa để chấp nhận
* **options**: MulterOptionsđối tượng tùy chọn , như được mô tả ở trên

```ts
@Post('upload')
@UseInterceptors(FilesInterceptor('files'))
uploadFile(@UploadedFiles() files) {
  console.log(files);
}
```

## Multiple files (Nhiều tệp)

Tải nhiều tệp -> **FileFieldsInterceptor()** decorator -> nhận 2 arguments:

**uploadedFields**: một mảng các đối tượng, mỗi đối tượng yêu cầu **name** property + chuỗi (Tên trường) và **maxCount**

****options**: MulterOptions đối tượng tùy chọn , như được mô tả ở trên

```ts
@Post('upload')
@UseInterceptors(FileFieldsInterceptor([
  { name: 'avatar', maxCount: 1 },
  { name: 'background', maxCount: 1 },
]))
uploadFile(@UploadedFiles() files) {
  console.log(files);
}
```

## Any files (Bất kỳ tệp nào)

Tải lên tất cả fileds có name keys tuỳ ý -> **AnyFilesInterceptor()** decorator

```ts
@Post('upload')
@UseInterceptors(AnyFilesInterceptor())
uploadFile(@UploadedFiles() files) {
  console.log(files);
}
```

## Default options (Tuỳ chọn mặc định)

Import **MulterModule.register()** -> all options [here](https://github.com/expressjs/multer#multeropts)

```ts
MulterModule.register({
  dest: '/upload',
});
```

## Async configuration (Cấu hình không đồng bộ)

Sử dụng **reigsterAsync()** method

Một kỹ thuật sử dụng một factory function 

```ts
MulterModule.registerAsync({
  useFactory: () => ({
    dest: '/upload',
  }),
});
```

Sử dụng **async** và đưa dependency thông qua **inject**

```ts
MulterModule.registerAsync({
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    dest: configService.getString('MULTER_DEST'),
  }),
  inject: [ConfigService],
});
```

Cấu hình sử dụng class

```ts
MulterModule.registerAsync({
    useClass: MulterConfigService,
});
```

**MulterConfigService** phải implement **MulterOptionsFactory** interface. **MulterModule** sẽ gọi **createMulterOptions()** method

```ts
@Injectable()
class MulterConfigService implements MulterOptionsFactory {
  createMulterOptions(): MulterModuleOptions {
    return {
      dest: '/upload',
    };
  }
}
```

Sử dụng lại options hiện có thay -> **useExisting** syntax:

```ts
MulterModule.registerAsync({
  imports: [ConfigModule],
  useExisting: ConfigService,
});
```