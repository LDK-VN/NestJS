import { applyDecorators, SetMetadata } from "@nestjs/common";

export function Auth(...roles: Role[]) {
    return applyDecorators(
        // here
    )
}