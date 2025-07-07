import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || '',
    });
  }

  validate(payload: { sub: string; email: string }) {
    // Exemplo de validação: rejeita se não houver sub ou email
    if (!payload?.sub || !payload?.email) {
      throw new UnauthorizedException('Token JWT inválido');
    }
    return { userId: payload.sub, email: payload.email };
  }
}
