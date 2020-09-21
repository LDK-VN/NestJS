import { LoggerService } from "@nestjs/common";

export class MyLogger implements LoggerService {
    log(message: string) {
        /** your implementation */
    }

    error(message: string, trace: string) {
        /** your implementation */
    }

    warn(message: any, context?: string) {
        throw new Error("Method not implemented.");
    }
    debug?(message: any, context?: string) {
        throw new Error("Method not implemented.");
    }
    verbose?(message: any, context?: string) {
        throw new Error("Method not implemented.");
    }
}