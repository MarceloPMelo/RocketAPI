import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    JwtModule.register({
      secret: 'c85651ceac34d0d0ebe076d1b34af6f12b7aed0f482642ae2bedebf75b1765e0a5b07866173b2b69adb5c48bbbd7bb0f5271adf0f7f349416cd5e8fe73e148cf', // Em produção, use variáveis de ambiente
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {} 