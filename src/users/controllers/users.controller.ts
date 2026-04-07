import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put, UseGuards } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { UserDTO, UserToProjectDTO, UserUpdateDTO } from '../dto/user.dto';
import { PublicAccess } from 'src/auth/decorators/public.decorator';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ApiHeader, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminAccess } from 'src/auth/decorators/admin.decorator';
import { AccessLevel } from 'src/auth/decorators/access-level.decorator';
import { ACCESS_LEVEL } from 'src/constants/roles';
import { ProjectsEntity } from 'src/projects/entities/projects.entity';

@ApiTags('Users')
@Controller('users')
@UseGuards(AuthGuard, RolesGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) {}
    
    @PublicAccess()
    @Post('register')
    public async registerUser(@Body() body: UserDTO) {
        return await this.usersService.createUser(body);
    }

    //@Roles('ADMIN')
    //@PublicAccess()
    @AdminAccess()
    @Get('all')
    public async findAllusers() {
        return await this.usersService.findUsers();
    }

    //@PublicAccess()
    @ApiParam({name: 'id',})
    @ApiHeader({
    name: 'codrr_token',
    })
    @ApiResponse({
        status: 400,
        description: 'No se encontro resultado'
    })
    @Get(':id')
    public async findUserById(@Param('id') id: string) {
        return await this.usersService.findUserById(id);
    }

    @ApiParam({
        name: 'projectId',
    })
    @AccessLevel(ACCESS_LEVEL.OWNER)
    @Post('add-to-project/:projectId')
    public async addToProject(@Body() body: UserToProjectDTO, @Param('projectId', new ParseUUIDPipe()) id: string,) {
        return await this.usersService.relationProject({
            ...body,
            project: id as unknown as ProjectsEntity,
        });
    }

    @ApiParam({
        name: 'id',
    })
    @Put('edit/:id')
    public async updateUser(
        @Param('id') id: string,
        @Body() body: UserUpdateDTO,
    ) {
        return await this.usersService.updateUser(body, id);
    }

    @ApiParam({
        name: 'id',
    })
    @Delete('delete/:id')
    public async deleteUser(
        @Param('id') id: string
    ) {
        return await this.usersService.deleteUser(id);
    }
}
