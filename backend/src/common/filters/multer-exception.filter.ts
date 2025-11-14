import {
    ExceptionFilter,
    Catch,
    ArgumentsHost, PayloadTooLargeException,
} from '@nestjs/common';

@Catch(PayloadTooLargeException)
export class MulterExceptionFilter implements ExceptionFilter {
    catch(exception: PayloadTooLargeException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();

        return response.status(400).json({
            statusCode: 400,
            message: 'Файл слишком большой. Максимальный размер - 20MB.',
        });
    }
}