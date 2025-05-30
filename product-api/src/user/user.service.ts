import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {}

    async create(createUserDto: CreateUserDto) {
        try {
            const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
            
            const user = await this.prisma.user.create({
                data: {
                    name: createUserDto.name,
                    email: createUserDto.email,
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
}
