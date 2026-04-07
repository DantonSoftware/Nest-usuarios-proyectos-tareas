import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TasksEntity } from '../entities/tasks.entity';
import { Repository } from 'typeorm';
import { ProjectsService } from 'src/projects/services/projects.service';
import { TasksDTO } from '../dto/tasks.dto';
import { ErrorManager } from 'src/utils/error.manager';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(TasksEntity)
        private readonly tasksRepository: Repository<TasksEntity>,
        private readonly projectsService: ProjectsService
    ) {}

    public async createTask(
        body: TasksDTO,
        projectId: string
    ): Promise<TasksEntity> {
        try {
            const project = await this.projectsService.findProjectById(projectId);
        if (!project) {
            throw new ErrorManager({
                type: 'NOT_FOUND',
                message: 'Proyecto no encontrado',
            });
        }
        return await this.tasksRepository.save({
            ...body,
            project,
        });
        } catch (error) {
            throw ErrorManager.createSignatureError(error?.message ?? String(error));
        }        
    }
}
