import { Body, Controller, Delete, Get, Post, Put, Param, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { ProjectsService } from '../services/projects.service';
import { ProjectDTO, ProjectUpdateDTO } from '../dto/project.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AccessLevelGuard } from 'src/auth/guards/access-level.guard';
import { AccessLevel } from 'src/auth/decorators/access-level.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { ACCESS_LEVEL } from 'src/constants/roles';
import { PublicAccess } from 'src/auth/decorators/public.decorator';

@ApiTags('Projects')
@Controller('projects')
@UseGuards(AuthGuard, RolesGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @ApiParam({
    name: 'userId',
  })
  @Roles('CREATOR')
  @Post('create/userOwner/:userId')
  public async createProject(@Body() body: ProjectDTO, @Param('userId') userId: string) {
    return this.projectsService.createProject(body, userId);
  }

  @UseGuards(AccessLevelGuard)
  @AccessLevel(50)
  @Put('edit/:projectId')
  public async updateProject(
    @Param('projectId', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() body: ProjectUpdateDTO,
  ) {
    return this.projectsService.updateProject(body, id);
  }

  @Get('all')
  public async findAll() {
    return this.projectsService.findAllProjects();
  }

  @PublicAccess()
  @Get('list/api')
  public async listApi() {
    return this.projectsService.listApi();
  }

  @ApiParam({
    name: 'projectId',
  })
  @Get(':projectId')
  public async findById(@Param('projectId', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.projectsService.findProjectById(id);
  }


  @ApiParam({
    name: 'projectId',
  })
  @AccessLevel(ACCESS_LEVEL.OWNER)
  @Delete('delete/:projectId')
  public async delete(@Param('projectId', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.projectsService.deleteProject(id);
  }
}
