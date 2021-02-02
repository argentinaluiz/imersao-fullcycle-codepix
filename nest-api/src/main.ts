import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { EntityNotFoundExceptionFilter } from './exception-filters/entity-not-found.exception-filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  let kafkaConsumerGroupId = process.env.KAFKA_CONSUMER_GROUP_ID;
  kafkaConsumerGroupId =
    !kafkaConsumerGroupId || kafkaConsumerGroupId === ''
      ? 'my-consumer-' + Math.random()
      : kafkaConsumerGroupId;

  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [process.env.KAFKA_BROKER],
      },
      consumer: {
        groupId: kafkaConsumerGroupId,
      },
    },
  });

  app.setGlobalPrefix('api');
  app.useGlobalFilters(new EntityNotFoundExceptionFilter());

  const options = new DocumentBuilder()
    .setTitle('Imersão FullCycle')
    .setDescription('Documentação da API do Nest.js')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/_doc', app, document);
  await app.startAllMicroservicesAsync();
  await app.listen(3000);
}
bootstrap();
