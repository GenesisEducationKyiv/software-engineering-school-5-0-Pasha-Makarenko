import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common"
import { ExceptionHandler } from "../../../infrastructure/common/interfaces/exception.handler.interface"
import { BaseException } from "../../../main/exceptions/base.exception"

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private filters: Map<string, ExceptionHandler<unknown>>) {}

  catch(exception: Error, host: ArgumentsHost) {
    if (exception instanceof BaseException) {
      const filter = this.filters.get(exception.code)

      if (filter) {
        filter.handle(exception, host)
      }
    }
  }
}
