import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { v4 as newId } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Task, TaskStatus } from './task.model';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
    const { search, status } = filterDto;

    let tasks = this.getAllTasks();

    if (status) {
      tasks = tasks.filter(task => task.status === status);
    }

    if (search) {
      tasks = tasks.filter(task => task.title.toUpperCase().includes(search.toUpperCase())
        || task.description.toUpperCase().includes(search.toUpperCase()));
    }

    return tasks;
  }

  getTaskById(id: string): Task {
    const foundTask = this.tasks.find(task => task.id === id);

    if (!foundTask) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return foundTask;
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;

    const task: Task = {
      id: newId(),
      title,
      description,
      status: TaskStatus.OPEN
    };

    this.tasks.push(task);

    return task;
  }

  deleteTask(id: string) {
    const foundTask = this.getTaskById(id);

    this.tasks = this.tasks.filter(task => task.id !== foundTask.id);
  }

  updateTask(id: string, field: string, value: string): Task {
    const task = this.getTaskById(id);

    if (field === 'status' && !TaskStatus[value]) {
      throw new HttpException('Status must be OPEN, IN_PROGRESS, or DONE', 400);
    }

    task[field] = value;

    return task;
  }
}
