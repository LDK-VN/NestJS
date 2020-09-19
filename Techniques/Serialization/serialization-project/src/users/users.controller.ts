import { ClassSerializerInterceptor, Controller, Get, SerializeOptions, UseInterceptors } from '@nestjs/common';
import { Expose } from 'class-transformer';
import { RoleEntity } from 'src/entity/role.entity';
import { UserEntiry } from 'src/entity/user.entity';

@SerializeOptions({
    excludePrefixes: ['_']
})
@Controller('users')
export class UsersController {

    @UseInterceptors(ClassSerializerInterceptor)
    @Get()
    findONe(): UserEntiry {
        return new UserEntiry({
            id: 1,
            firstName: 'Khanh',
            _lastName: "Le Duy",
            password: 'password',
            role: new RoleEntity({
                name:'khanhd',
                role:'admin'
            })
        });
    }

}
