import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsModule } from './cats/cats.module';

@Module({
  imports: [GraphQLModule.forRoot({
    debug: false,
    playground: false,
    include: [CatsModule],
    autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    sortSchema: true
    // autoSchemaFile:
  }), CatsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
