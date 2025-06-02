import { IsNotEmpty, IsNumber } from "class-validator";



export class CartDto {
    @IsNotEmpty()
    @IsNumber()
    productId: number;
}