import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task } from '../schemas/task.schema';
import { Model } from 'mongoose';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private taskModel: Model<Task>) {}

  async create(createTaskDto: CreateTaskDto) {
    const task = new this.taskModel(createTaskDto);
    return task.save();
  }

  async findAll(user: any) {
    if (user.role === 'admin') {
      return this.taskModel.find().populate('assignedTo', 'email role');
    } else {
      return this.taskModel.find({ assignedTo: user.userId });
    }
  }

  async findOne(id: string, user: any) {
    const task = await this.taskModel.findById(id);
    if (!task) throw new NotFoundException('Task not found');

    if (user.role !== 'admin' && task.assignedTo.toString() !== user.userId) {
      throw new ForbiddenException(
        'No cuenta con los privilegios para realizar la accion seleccionada.',
      );
    }

    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, user: any) {
    const task = await this.taskModel.findById(id);
    if (!task) throw new NotFoundException('Tarea no encontrada');

    if (user.role !== 'admin' && task.assignedTo.toString() !== user.userId) {
      throw new ForbiddenException(
        'No cuenta con los privilegios para realizar la accion seleccionada.',
      );
    }

    Object.assign(task, updateTaskDto);
    return task.save();
  }

  async delete(id: string, user: any) {
    const task = await this.taskModel.findById(id);
    if (!task) throw new NotFoundException('Tarea no encontrada');

    if (user.role !== 'admin' && task.assignedTo.toString() !== user.userId) {
      throw new ForbiddenException(
        'No cuenta con los privilegios para realizar la accion seleccionada.',
      );
    }

    return this.taskModel.deleteOne({ _id: id });
  }
}
