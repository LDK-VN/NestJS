export class RoleEntity {
    name: string;
    role: string;

    constructor(partial: Partial<RoleEntity>) {
        Object.assign(this, partial);
    }
}