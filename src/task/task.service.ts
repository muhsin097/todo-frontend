// task.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { Model, Mongoose, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './entity/task.entity';
import { ProjectService } from 'src/project/project.service';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<Task>,
    private readonly projectService: ProjectService,
  ) {}

  async findAll(
    userId: string,
    searchTerm?: string,
    labels?: string[],
    priority?: string,
  ): Promise<Task[]> {
    const query: any = this.getQuery(searchTerm, labels, priority);
    query.userId = new Types.ObjectId(userId);
    return this.taskModel.find(query).exec();
  }

  async findByProjectId(
    id: string,
    searchTerm?: string,
    labels?: string[],
    priority?: string,
  ): Promise<Task[]> {
    const query: any = this.getQuery(searchTerm, labels, priority);
    query.project = new Types.ObjectId(id);
    const tasks = await this.taskModel.find(query).exec();
    if (!tasks) {
      throw new NotFoundException('Tasks not found');
    }
    return tasks;
  }

  getQuery(searchTerm, labels?, priority?) {
    let query = {};
    if (searchTerm) {
      query['name'] = { $regex: new RegExp(searchTerm, 'i') };
    }
    if (labels && labels.length > 0) {
      query['labels'] = { $in: labels };
    }
    if (priority) {
      query['priority'] = priority;
    }
    return query;
  }

  async findById(id: string): Promise<Task> {
    const task = await this.taskModel.findById(id).exec();
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  async create(createTask: CreateTaskDto): Promise<Task> {
    const createTaskDto = {
      ...createTask,
      userId: new Types.ObjectId(createTask?.userId),
    };
    if (createTaskDto.projectId) {
      const createdTask = new this.taskModel(createTaskDto);
      return createdTask.save();
    } else if (createTaskDto?.projectName) {
      const { projectName, projectDescription, ...taskData } = createTaskDto;
      const project = await this.projectService.create({
        name: projectName,
        description: projectDescription,
      });
      const createdTask = new this.taskModel({
        ...taskData,
        project: new Types.ObjectId(project.id),
      });
      return createdTask.save();
    } else {
      const createdTask = new this.taskModel({
        ...createTaskDto,
      });
      return createdTask.save();
    }
  }

  async update(id: string, updateTaskDto: CreateTaskDto): Promise<Task> {
    const updatedTask = await this.taskModel
      .findByIdAndUpdate(
        id,
        { ...updateTaskDto, userId: new Types.ObjectId(updateTaskDto?.userId) },
        { new: true },
      )
      .exec();
    if (!updatedTask) {
      throw new NotFoundException('Task not found');
    }
    return updatedTask;
  }

  async delete(id: string): Promise<void> {
    const result = await this.taskModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Task not found');
    }
  }

  async findTodayTasks(userId: string): Promise<Task[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to the beginning of the day
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1); // Set to the beginning of the next day

    return this.taskModel
      .find({
        date: { $gte: today, $lt: tomorrow },
        userId: new Types.ObjectId(userId),
      })
      .sort({ date: 1 })
      .exec();
  }

  async findUpcomingTasks(userId: string): Promise<Task[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to the beginning of the day
    return this.taskModel
      .find({ date: { $gt: today }, userId: new Types.ObjectId(userId) })
      .sort({ date: 1 })
      .exec();
  }
}
