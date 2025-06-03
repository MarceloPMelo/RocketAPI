import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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

        for (const item of cart.items) {
            await this.decrementProductCount(item.productId, item.quantity);
        }

        return {
            message: 'Order created successfully',
            statusCode: 201,
            data: order
        };
    }

    async decrementProductCount(productId: number, amount: number) {

        const product = await this.prisma.product.findUnique({
            where: { id: productId }
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        // Verifica se há estoque suficiente
        if (product.count < amount) {
            throw new BadRequestException('Insufficient stock for product ' + product.title );
        }

        // Atualiza o estoque
        const updatedProduct = await this.prisma.product.update({
            where: { id: productId },
            data: {
                count: product.count - amount
            }
        });

        return {
            message: 'Product stock updated successfully',
            statusCode: 200,
            data: {
                productId: updatedProduct.id,
                previousCount: product.count,
                decrementedAmount: amount,
                currentCount: updatedProduct.count
            }
        };
    }

    async getUserOrders(userId: number) {
        const orders = await this.prisma.order.findMany({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                title: true,
                                image: true,
                                price: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return {
            message: 'Orders retrieved successfully',
            statusCode: 200,
            data: orders.map(order => ({
                id: order.id,
                createdAt: order.createdAt,
                total: order.total,
                itemsCount: order.items.length,
                items: order.items.map(item => ({
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    subtotal: item.quantity * item.unitPrice,
                    product: item.product
                }))
            }))
        };
    }
}
