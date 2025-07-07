import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { ClientService } from '../client/client.service';
import { Client } from '../database/entities/client.entity';

@Injectable()
export class AuthService {
  constructor(
    private clientService: ClientService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<Client | null> {
    const client = await this.clientService.findByEmail(email);
    if (client && (await bcrypt.compare(pass, client.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...result } = client;
      return result as Client;
    }
    return null;
  }

  login(client: Client) {
    const payload = { email: client.email, sub: client.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
