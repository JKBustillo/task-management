import { Test } from '@nestjs/testing';

import { TasksRepository } from './tasks.repository';
import { TasksService } from './tasks.service';
import { TaskStatus } from './task-status.enum';

const mockTasksRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn()
});

const mockUser = {
  id: '1',
  username: 'User',
  password: 'password',
  tasks: []
};

describe('Tasks services', () => {
  let tasksService: TasksService;
  let tasksRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TasksRepository, useFactory: mockTasksRepository }
      ]
    }).compile();

    tasksService = module.get(TasksService);
    tasksRepository = module.get(TasksRepository);
  });

  describe('getTasks', () => {
    it('should call TasksRepository.getTasks and return the result', async () => {
      tasksRepository.getTasks.mockResolvedValue([]);
      const result = await tasksService.getTasks({}, mockUser);
      expect(result).toEqual([]);
    });
  });

  describe('getTaskById', () => {
    it('should call TasksRepository.findOne and return the result', async () => {
      const mockTask = {
        id: 'basdasdasd',
        title: 'Learn Angular',
        description: 'Learn another JS framwork',
        status: TaskStatus.OPEN
      };

      tasksRepository.findOne.mockResolvedValue(mockTask);
      const result = await tasksService.getTaskById('basdasdasd', mockUser);
      expect(result).toEqual(mockTask);
    });

    it('should call TasksRepository.getTaskById and return the result', async () => {
      tasksRepository.findOne.mockResolvedValue(null);

      expect(tasksService.getTaskById('basdasdasd', mockUser)).rejects.toThrow(
        'Task with ID "basdasdasd" not found'
      );
    });
  });
});
