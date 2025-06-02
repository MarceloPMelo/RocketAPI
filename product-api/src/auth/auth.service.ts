import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';


@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) { }

  async login(email: string, password: string) {
    // Busca o usuário pelo email
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        name: true,
        role: true
      }
    });

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Verifica a senha
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Gera o token JWT
    const payload = { 
      sub: user.id, 
      email: user.email,
      role: user.role 
    };
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role 
      }
    };
  }
  async getProfile(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    return user;
  }


  async register(registerDto: RegisterDto) {
    try {
      const hashedPassword = await bcrypt.hash(registerDto.password, 10);

      const user = await this.prisma.user.create({
        data: {
          name: registerDto.name,
          email: registerDto.email,
          password: hashedPassword
        },
        select: {
          id: true,
          name: true,
          email: true,
          // Não retorna o password por segurança
        }
      });
      const cart = await this.prisma.cart.create({
        data: {
          userId: user.id
        }
      });
      return {
        message: 'Usuário criado com sucesso',
        user,
        cart
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Email já cadastrado');
      }
      throw new InternalServerErrorException('Erro ao criar usuário');
    }

  }

  async registerAdmin(registerDto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        name: registerDto.name,
        email: registerDto.email,
        password: hashedPassword,
        role: 'ADMIN'
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    });
    return user;
  }
}