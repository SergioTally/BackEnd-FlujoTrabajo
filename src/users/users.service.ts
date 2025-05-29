import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
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
      throw new ConflictException('Email already registered');
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
}
