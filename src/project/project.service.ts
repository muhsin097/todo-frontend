import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Project } from './entity/project.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Project.name) private readonly projectModel: Model<Project>,
  ) {}

  async findAll(): Promise<Project[]> {
    return this.projectModel.find().exec();
  }

  async findById(id: string): Promise<Project> {
    const project = await this.projectModel.findById(id).exec();
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    return project;
  }

  async create(projectData: {
    name: string;
    description: string;
  }): Promise<Project> {
    const createdProject = new this.projectModel(projectData);
    return createdProject.save();
  }

}
