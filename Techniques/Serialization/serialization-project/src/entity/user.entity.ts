import { Exclude, Expose, Transform } from "class-transformer";
import { RoleEntity } from "./role.entity";

export class UserEntiry {
    id: number;
    firstName: string;
    _lastName: string;

    @Exclude()
    password: string;

    constructor(partial: Partial<UserEntiry>) {
        Object.assign(this, partial);
    }

    @Expose()
    get fullName(): string {
        return `${this.firstName} ${this._lastName}`;
    }

    @Transform(role => role.name)
    role: RoleEntity;
}