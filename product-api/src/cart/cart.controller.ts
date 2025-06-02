import { Controller, Get, Post, Request, Body, Param, ParseIntPipe, Delete } from '@nestjs/common';
import { CartService } from './cart.service';


@Controller('cart')
export class CartController {
    constructor(private readonly cartService: CartService) {}

    @Get()
    async getCart(@Request() req: any) {
        return this.cartService.getCart(req.user.id);
    }

    @Post('add/:productId')
    async addToCart(@Request() req: any, @Param('productId', ParseIntPipe) productId: number) {
        return this.cartService.addToCart(productId, req.user.id);
    }

    @Delete('remove/:productId')
    async removeFromCart(@Request() req: any, @Param('productId', ParseIntPipe) productId: number) {
        return this.cartService.removeFromCart(productId, req.user.id);
    }
}
