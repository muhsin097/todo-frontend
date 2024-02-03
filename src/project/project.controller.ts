import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ProjectService } from './project.service';
import { Project } from './entity/project.entity';
import { Task } from 'src/task/entity/task.entity';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  async findAllProjects(): Promise<Project[]> {
    return this.projectService.findAll();
  }

  @Get(':id')
  async findProjectById(@Param('id') id: string): Promise<Project> {
    return this.projectService.findById(id);
  }

  @Post()
  async createProject(
    @Body() projectData: { name: string; description: string },
  ): Promise<Project> {
    return this.projectService.create(projectData);
  }

}
