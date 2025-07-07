import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Client } from '../database/entities/client.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  async create(
    createClientDto: CreateClientDto,
  ): Promise<Omit<Client, 'password'>> {
    const { name, email, password } = createClientDto;

    const existClient = await this.clientRepository.findOne({
      where: { email },
    });
    if (existClient) {
      throw new ConflictException('email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newClient = this.clientRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    const savedClient = await this.clientRepository.save(newClient);

    const { password: _, ...result } = savedClient;
    return result;
  }

  async findAll(): Promise<Omit<Client, 'password'>[]> {
    const clients = await this.clientRepository.find();
    return clients.map(
      ({ password, ...rest }) => rest as Omit<Client, 'password'>,
    );
  }

  async findOne(id: number): Promise<Omit<Client, 'password'>> {
    const client = await this.clientRepository.findOne({ where: { id } });
    if (!client) throw new NotFoundException('Client not found');
    const { password, ...rest } = client;
    return rest as Omit<Client, 'password'>;
  }

  async findByEmail(email: string): Promise<Client | null> {
    return this.clientRepository.findOne({ where: { email } });
  }

  async update(
    id: number,
    updateClientDto: UpdateClientDto,
  ): Promise<Omit<Client, 'password'>> {
    const client = await this.clientRepository.preload({
      id,
      ...updateClientDto,
    });
    if (!client) throw new NotFoundException('Client not found');
    const saved = await this.clientRepository.save(client);
    const { password, ...rest } = saved;
    return rest as Omit<Client, 'password'>;
  }

  async remove(id: number): Promise<void> {
    const client = await this.clientRepository.findOne({ where: { id } });
    if (!client) throw new NotFoundException('Client not found');
    await this.clientRepository.remove(client);
  }
}
