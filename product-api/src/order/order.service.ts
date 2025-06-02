import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrderService {
    constructor(private readonly prisma: PrismaService) {}

    async createOrder(userId: number) {
        // Busca o carrinho com seus itens
        const cart = await this.prisma.cart.findFirst({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        });

        if (!cart) {
            throw new NotFoundException('Cart not found');
        }

        if (cart.items.length === 0) {
            throw new NotFoundException('Cart is empty');
        }

        // Calcula o total do pedido
        const total = cart.items.reduce((acc, item) => {
            return acc + (item.quantity * item.product.price);
        }, 0);

        // Cria a ordem em uma transação
        const order = await this.prisma.$transaction(async (prisma) => {
            // Cria a ordem
            const newOrder = await prisma.order.create({
                data: {
                    userId,
                    cartId: cart.id,
                    total,
                    items: {
                        create: cart.items.map(item => ({
                            productId: item.productId,
                            quantity: item.quantity,
                            unitPrice: item.product.price
                        }))
                    }
                },
                include: {
                    items: true
                }
            });

            // Limpa os itens do carrinho
            await prisma.cartItem.deleteMany({
                where: {
                    cartId: cart.id
                }
            });

            return newOrder;
        });

        return {
            message: 'Order created successfully',
            statusCode: 201,
            data: order
        };
    }

    
}
