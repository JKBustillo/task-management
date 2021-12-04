import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from 'src/auth/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TasksRepository } from './tasks.repository';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository)
    private tasksRepository: TasksRepository
  ) {}

  getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    return this.tasksRepository.getTasks(filterDto, user);
  }

  async getTaskById(id: string): Promise<Task> {
    const foundTask = await this.tasksRepository.findOne(id);

    if (!foundTask)
      throw new NotFoundException(`Task with ID "${id}" not found`);

    return foundTask;
  }

  createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDto, user);
  }

  async deleteTask(id: string): Promise<void> {
    const result = await this.tasksRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
  }

  async updateTask(id: string, field: string, value: string): Promise<Task> {
    const task = await this.getTaskById(id);

    if (field === 'status' && !TaskStatus[value]) {
      throw new HttpException('Status must be OPEN, IN_PROGRESS, or DONE', 400);
    }

    task[field] = value;

    await this.tasksRepository.save(task);

    return task;
  }
}
