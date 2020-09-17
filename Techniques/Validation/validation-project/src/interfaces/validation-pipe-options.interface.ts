import { ValidationError } from "@nestjs/common";
import { ValidatorOptions } from "@nestjs/common/interfaces/external/validator-options.interface";

export interface ValidationPipeOptions extends ValidatorOptions {
    transform?: boolean;
    disableErrorMessage?: boolean;
    exceptionFactory?: (errors: ValidationError[]) => any;
}