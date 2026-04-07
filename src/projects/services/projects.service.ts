import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { ProjectsEntity } from '../entities/projects.entity';
import { ProjectDTO, ProjectUpdateDTO } from '../dto/project.dto';
import { ErrorManager } from 'src/utils/error.manager';
import { UsersProjectsEntity } from 'src/users/entities/usersProjects.entity';
import { ACCESS_LEVEL } from 'src/constants/roles';
import { UsersService } from 'src/users/services/users.service';
import { HttpCustomService } from 'src/providers/http/http.service';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(ProjectsEntity)
    private readonly projectsRepository: Repository<ProjectsEntity>,
    @InjectRepository(UsersProjectsEntity)
    private readonly usersProjectsRepository: Repository<UsersProjectsEntity>,
    private readonly usersService: UsersService,
    private readonly httpSErvice: HttpCustomService,
  ) {}

  public async createProject(body: ProjectDTO, userId: string): Promise<ProjectsEntity> {
    try {
      const user = await this.usersService.findUserById(userId);
      const project = await this.projectsRepository.create(body);
      const savedProject = await this.projectsRepository.save(project);

      console.log({
        accessLevel: ACCESS_LEVEL.OWNER,
        user,
        project: savedProject,
      });

      const relation = this.usersProjectsRepository.create({
        accessLevel: ACCESS_LEVEL.OWNER,
        user: user,
        project: savedProject,
      });

      await this.usersProjectsRepository.save(relation);
      // await this.usersProjectsRepository.save({
      //   accessLevel: ACCESS_LEVEL.OWNER,
      //   user: user,
      //   project: body
      // });
      
      return savedProject;
    } catch (error) {
      throw ErrorManager.createSignatureError(String(error));
    }
    
  }

  public async updateProject(body: ProjectUpdateDTO, id: string): Promise<UpdateResult> {
    const result = await this.projectsRepository.update(id, body);

    if (!result.affected) {
      throw new ErrorManager({
        type: 'BAD_REQUEST',
        message: 'No se pudo actualizar',
      });
    }

    return result;
  }

  public async findAllProjects(): Promise<ProjectsEntity[]> {
      try {
        return await this.projectsRepository.find();
      } catch (error: any) {
        throw ErrorManager.createSignatureError(error?.message ?? String(error));
      }
    }

  public async findProjectById(id: string): Promise<ProjectsEntity> {
    try {
      const project = await this.projectsRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.usersIncludes', 'usersIncludes')
      .leftJoinAndSelect('usersIncludes.user', 'user') // si quieres traer el user también
      .where('project.id = :id', { id })
      .getOne();

      if (!project) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'No se encontro resultado',
        });
      }

      return project;
    } catch (error: any) {
      throw ErrorManager.createSignatureError(error?.message ?? String(error));
    }
  }

  public async listApi() {
    return this.httpSErvice.apiFindAll();
  }

  public async deleteProject(id: string): Promise<DeleteResult> {
    try {
      const result = await this.projectsRepository.delete(id);

      if (!result.affected) {
        throw new ErrorManager({
          type: 'BAD_REQUEST',
          message: 'No se pudo eliminar',
        });
      }

      return result;
    } catch (error: any) {
      throw ErrorManager.createSignatureError(error?.message ?? String(error));
    }
  }

}
