import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  Put,
  Query,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './entity/task.entity';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get('user/:id')
  async findAll(
    @Param('id') id: string,
    @Query('searchTerm') searchTerm?: string,
    @Query('labels') labels?: string[],
    @Query('priority') priority?: string,
  ): Promise<Task[]> {
    return this.taskService.findAll(id, searchTerm, labels, priority);
  }

  @Get('today/:id')
  async findTodayTasks(@Param('id') id: string): Promise<Task[]> {
    return this.taskService.findTodayTasks(id);
  }

  @Get('upcoming/:id')
  async findUpcomingTasks(@Param('id') id: string): Promise<Task[]> {
    return this.taskService.findUpcomingTasks(id);
  }

  @Get(':id/tasks')
  async findTasksByProjectId(
    @Param('id') projectId: string,
    @Query('searchTerm') searchTerm?: string,
    @Query('labels') labels?: string[],
    @Query('priority') priority?: string,
  ): Promise<Task[]> {
    return this.taskService.findByProjectId(
      projectId,
      searchTerm,
      labels,
      priority,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Task> {
    return this.taskService.findById(id);
  }

  @Post()
  async create(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskService.create(createTaskDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTaskDto: CreateTaskDto,
  ): Promise<Task> {
    return this.taskService.update(id, updateTaskDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.taskService.delete(id);
  }
}
