import { Controller, Get, Post, Request, Body, Param, ParseIntPipe, Delete } from '@nestjs/common';
import { CartService } from './cart.service';
import { Auth } from 'src/auth/auth.decorator';
import { CartDto } from './dto/cart.dto';

@Controller('cart')
export class CartController {
    constructor(private readonly cartService: CartService) {}

    @Get()
    @Auth()
    async getCart(@Request() req: any) {
        return this.cartService.getCart(req.user.id);
    }

    @Post('add/:productId')
    @Auth()
    async addToCart(@Request() req: any, @Param('productId', ParseIntPipe) productId: number) {
        return this.cartService.addToCart(productId, req.user.id);
    }

    @Delete('remove/:productId')
    @Auth()
    async removeFromCart(@Request() req: any, @Param('productId', ParseIntPipe) productId: number) {
        return this.cartService.removeFromCart(productId, req.user.id);
    }
}
