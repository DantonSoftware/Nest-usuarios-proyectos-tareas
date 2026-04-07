import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import morgan from 'morgan';
import { CORS } from './constants';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    snapshot: true,
  });

  // ✅ Usa el middleware de morgan correctamente
  app.use(morgan('dev'))  

  app.useGlobalPipes(new ValidationPipe({
    transformOptions:{
      enableImplicitConversion: true,
    },
  }));

  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));

  const configService = app.get(ConfigService);

  app.enableCors(CORS);

  app.setGlobalPrefix('api');
  const config = new DocumentBuilder()
    .setTitle('Task API')
    .setDescription('Aplicacion de gestion de tareas')
    .setVersion('1.0')    
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  app.setGlobalPrefix('api');

  // Lee PORT como number y usa 3000 si no viene
  const port = configService.get<number>('PORT') ?? 3000;
  await app.listen(port);
  console.log(`Application running on: ${await app.getUrl()}`);

}
bootstrap();
