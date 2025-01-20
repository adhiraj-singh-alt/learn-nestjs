import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsModule } from '../cats/cats.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '../users/user.module';
import { MulterModule } from '@nestjs/platform-express';
import { LoggerMiddleware } from 'src/middlewares/logger.middleware';

@Module({
  imports: [
    CatsModule,
    UserModule,
    ConfigModule.forRoot({ isGlobal: true }),
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({ path: 'cats', method: RequestMethod.GET });
  }
}
