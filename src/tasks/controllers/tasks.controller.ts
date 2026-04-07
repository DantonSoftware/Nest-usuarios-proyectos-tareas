import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { TasksService } from '../services/tasks.service';
import { TasksDTO } from '../dto/tasks.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AccessLevel } from 'src/auth/decorators/access-level.decorator';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { ACCESS_LEVEL } from 'src/constants/roles';

@ApiTags('Tasks')
@Controller('tasks')
@UseGuards(AuthGuard, RolesGuard)
export class TasksController {
    constructor(
        private readonly tasksService: TasksService
    ) {}

    @ApiParam({
        name: 'id',
    })
    @AccessLevel(ACCESS_LEVEL.DEVELOPER)
    @Post('create/:projectId')
    public async createTask(
        @Body() body: TasksDTO, 
        @Param('projectId') projectId: string            
    ) {
        return this.tasksService.createTask(body, projectId);
    }

}
