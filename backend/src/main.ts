// import * as nodeCrypto from 'crypto';
// (global as any).nodeCrypto = nodeCrypto;
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";

async function start() {
    const PORT = process.env.PORT || 5000;
    const app = await NestFactory.create(AppModule)
    app.setGlobalPrefix('api');
    app.enableCors({
      origin: [
        "http://localhost:3000",
        "http://localhost:5000",
        "http://localhost:7000",
        "https://e8e0-95-214-210-204.ngrok-free.app"
      ],
    });
    const config = new DocumentBuilder()
        .setTitle('Backend - Oson Dastur')
        .setDescription('REST API - documentation')
        .setVersion('1.0.0')
        .addTag('Oson Dastur')
        .build()
    
    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('api/docs', app, document)
    
    
    // app.useGlobalGuards(JwtAuthGuard)
    app.useGlobalPipes(new ValidationPipe)

    await app.listen(PORT, () => console.log(`Server started on port = ${PORT}`))

}

start()