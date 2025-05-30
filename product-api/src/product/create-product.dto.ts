import { IsEmail, IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    nome: string;

    @IsString()
    descricao: string;

    
    
    @IsNumber()
    preco: number;

    @IsNumber()
    estoque: number

    @IsString()
    categoria: string
} 

