import { EntityRepository, Repository } from 'typeorm';

import { User } from 'src/auth/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';

@EntityRepository(Task)
export class TasksRepository extends Repository<Task> {
  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user
    });

    await this.save(task);

    return task;
  }

  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    const { search, status } = filterDto;

    const query = this.createQueryBuilder('task').andWhere({ user });

    if (search) {
      query.andWhere(
        '(UPPER(task.title) LIKE :search OR UPPER(task.description) LIKE :search)',
        { search: `%${search.toUpperCase()}%` }
      );
    }

    if (status) query.andWhere('task.status = :status', { status });

    const tasks = await query.getMany();

    return tasks;
  }
}
