import { Controller, Get, Post, Request, Body } from '@nestjs/common';
import { CartService } from './cart.service';
import { Auth } from 'src/auth/auth.decorator';

@Controller('cart')
export class CartController {
    constructor(private readonly cartService: CartService) {}

    @Get()
    @Auth()
    async getCart(@Request() req: any) {
        return this.cartService.getCart(req.user.id);
    }

    @Post('add')
    @Auth()
    async addToCart(@Request() req: any, @Body() body: { productId: number}) {
        return this.cartService.addToCart(body.productId, req.user.id);
    }
}
