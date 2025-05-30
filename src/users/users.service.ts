import {
  Injectable,
  ConflictException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  async createUser(createUserDto: CreateUserDto) {
    const existingUser = await this.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('Correo previamente registrado');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = new this.userModel({
      email: createUserDto.email,
      password: hashedPassword,
      role: createUserDto.role || 'normal',
    });

    return user.save();
  }

  async findAll() {
    return this.userModel.find().select('-password'); // Oculta los passwords
  }

  async findOne(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException('Usuario no identificado');

    return user;
  }

  async delete(id: string, user: any) {
    const task = await this.userModel.findById(id);
    if (!task) throw new NotFoundException('Usuario no encontrado');

    if (user.role !== 'admin') {
      throw new ForbiddenException(
        'No cuenta con los privilegios para realizar la accion seleccionada.',
      );
    }

    return this.userModel.deleteOne({ _id: id });
  }

  async update(id: string, updateTaskDto: UpdateUserDto, user: any) {
    const task = await this.userModel.findById(id);
    if (!task) throw new NotFoundException('Usuario no encontrado');

    if (user.role !== 'admin') {
      throw new ForbiddenException(
        'No cuenta con los privilegios para realizar la accion seleccionada.',
      );
    }

    Object.assign(task, updateTaskDto);
    return task.save();
  }
}
