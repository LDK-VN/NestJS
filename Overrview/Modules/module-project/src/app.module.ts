import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsModule } from './cats/cats.module';
import { DatabaseModule } from './database/database.module';
import { Connection } from './connection';
import { User } from './entity/user.entity';

@Module({
  imports: [CatsModule, DatabaseModule.forRoot([User])],
  controllers: [AppController],
  providers: [AppService, Connection],
})
export class AppModule {}
