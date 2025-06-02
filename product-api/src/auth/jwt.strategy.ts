// src/auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'c85651ceac34d0d0ebe076d1b34af6f12b7aed0f482642ae2bedebf75b1765e0a5b07866173b2b69adb5c48bbbd7bb0f5271adf0f7f349416cd5e8fe73e148cf',
    });
  }

  async validate(payload: any) {
    // O que for retornado aqui estará disponível no request.user
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role
    };
  }
}
