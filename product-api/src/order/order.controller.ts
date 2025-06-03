import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {

    constructor(private readonly orderService: OrderService) {}

    @Post()
    async createOrder(@Req() req: any) {
        return this.orderService.createOrder(req.user.id);
    }

    @Get()
    async getUserOrders(@Req() req: any) {
        return this.orderService.getUserOrders(req.user.id);
    }
    
}
