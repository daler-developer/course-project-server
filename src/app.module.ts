import { Module, NestModule, MiddlewareConsumer, Global } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { PopulateUserMiddleware } from './core/populate-user.middleware';
import { RequestService } from './core/request.service';
import { UsersModule } from './users/users.module';
import { CollectionsModule } from './collections/collections.module';
import { ItemsModule } from './items/items.module';
import { CommentsModule } from './comments/comments.module';
import { TagsModule } from './tags/tags.module';

@Global()
@Module({
  imports: [
    AuthModule,
    UsersModule,
    CollectionsModule,
    ItemsModule,
    TagsModule,
    CommentsModule,
    MongooseModule.forRoot(
      'mongodb+srv://daler-developer:blablabla@cluster0.w93fir2.mongodb.net/?retryWrites=true&w=majority',
    ),
  ],
  controllers: [],
  providers: [RequestService],
  exports: [RequestService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PopulateUserMiddleware).forRoutes('*');
  }
}
