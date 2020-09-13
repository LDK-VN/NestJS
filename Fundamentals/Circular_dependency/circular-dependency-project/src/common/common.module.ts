import { forwardRef, Module } from '@nestjs/common';
import { CatsModule } from 'src/cats/cats.module';

@Module({
    imports: [forwardRef(() => CatsModule)]
})
export class CommonModule {}
