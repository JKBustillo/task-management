import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';

@EntityRepository(Task)
export class TasksRepository extends Repository<Task> {
  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = this.create({
      title,
      description,
      status: TaskStatus.OPEN
    });

    await this.save(task);

    return task;
  }

  async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    const { search, status } = filterDto;

    const query = this.createQueryBuilder('task');

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
