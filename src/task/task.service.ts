import { Injectable, NotFoundException } from '@nestjs/common';
import { Model, Mongoose, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './entity/task.entity';
import { ProjectService } from 'src/project/project.service';
import { LabelService } from './label/label.service';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<Task>,
    private readonly projectService: ProjectService,
    private readonly labelService: LabelService,
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
      subTasks: createTask?.subTasks?.map((task) => new Types.ObjectId(task)),
    };
    const newLabels = createTask?.labels;
    await this.labelService.createBulkLabel({
      name: newLabels,
      userId: createTask?.userId,
    });

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

  async update(id: string, updateTask: CreateTaskDto): Promise<Task> {
    const taskToUpdate = await this.taskModel.findById(id).exec();
    const updateTaskDto = {
      ...updateTask,
      userId: new Types.ObjectId(updateTask?.userId),
      subTasks: updateTask?.subTasks?.map((task) => new Types.ObjectId(task)),
    };
    if (!taskToUpdate) {
      throw new NotFoundException('Task not found');
    }
    if (updateTaskDto.isDone) {
      const updatedTask = await this.taskModel
        .findByIdAndUpdate(
          id,
          {
            ...updateTaskDto,
          },
          { new: true },
        )
        .exec();
      await this.taskModel.updateMany(
        { _id: { $in: taskToUpdate.subTasks } },
        { $set: { isDone: true } },
      );

      if (!updatedTask) {
        throw new NotFoundException('Task not found');
      }

      return updatedTask;
    } else {
      const updatedTask = await this.taskModel
        .findByIdAndUpdate(
          id,
          {
            ...updateTaskDto,
          },
          { new: true },
        )
        .exec();

      if (!updatedTask) {
        throw new NotFoundException('Task not found');
      }
      return updatedTask;
    }
  }

  async delete(id: string): Promise<void> {
    const result = await this.taskModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Task not found');
    }
  }

  async findTodayTasks(userId: string): Promise<Task[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return this.taskModel
      .aggregate([
        {
          $match: {
            date: { $gte: today, $lt: tomorrow },
            userId: new Types.ObjectId(userId),
          },
        },
        {
          $lookup: {
            from: 'tasks',
            localField: 'subTasks',
            foreignField: '_id',
            as: 'subTasksDetails',
          },
        },
        {
          $sort: { date: 1 },
        },
      ])
      .exec();
  }

  async findUpcomingTasks(userId: string): Promise<Task[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.taskModel
      .aggregate([
        {
          $match: {
            date: { $gt: today },
            userId: new Types.ObjectId(userId),
          },
        },
        {
          $lookup: {
            from: 'tasks',
            localField: 'subTasks',
            foreignField: '_id',
            as: 'subTasksDetails',
          },
        },
        {
          $sort: { date: 1 },
        },
      ])
      .exec();
  }
}
