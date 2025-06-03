import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ProductDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString()
    @IsNotEmpty()
    image: string;

    @IsNumber()
    @IsNotEmpty()
    price: number;

    @IsNumber() 
    @IsNotEmpty()
    count: number

    @IsString()
    @IsNotEmpty()
    category: string

    @IsNumber()
    @IsNotEmpty()
    rate: number;
} 


