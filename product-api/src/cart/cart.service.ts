import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CartService {
    constructor(private readonly prisma: PrismaService) { }

    async getCart(userId: number) {
        return this.prisma.cart.findFirst({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                title: true,
                            }
                        }
                    }
                }
            }
        });
    }

    async addToCart(productId: number, userId: number) {
        const cart = await this.prisma.cart.findFirst({
            where: { userId }
        });

        if (!cart) {
            throw new Error('Cart not found');
        }
        const cartItem = await this.prisma.cartItem.findFirst({
            where: { productId, cartId: cart.id }
        });

        if (cartItem) {
            return this.prisma.cartItem.update({
                where: { id: cartItem.id },
                data: {
                    quantity: cartItem.quantity + 1
                }
            });
        }

        else {
            return this.prisma.cartItem.create({
                data: {
                    productId,
                    cartId: cart.id,
                    quantity: 1,
                    unitPrice: 0
                }
            });
        }
    }
}