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

    async createCart(userId: number) {
        const cart = await this.prisma.cart.create({
            data: { userId }
        });
        return cart;
    }

    

    

    async addToCart(productId: number, userId: number) {

        //verificar se o productId é um número e positivo
        if (isNaN(productId) || productId <= 0) {
            return {
                message: 'Product ID must be a positive number',
                statusCode: 400
            }
        }

        const cart = await this.prisma.cart.findFirst({
            where: { userId }
        });

        if (!cart) {
            return {
                message: 'Cart not found',
                statusCode: 404
            }
        }

        const product = await this.prisma.product.findUnique({
            where: { id: productId }
        });

        if (!product) {
            return {
                message: 'Product not found',
                statusCode: 404
            }
        }

        const cartItem = await this.prisma.cartItem.findFirst({
            where: { productId, cartId: cart.id }
        });

        if (cartItem) {
            const updatedItem = await this.prisma.cartItem.update({
                where: { id: cartItem.id },
                data: {
                    quantity: cartItem.quantity + 1
                }
            });
            return {
                message: 'Item quantity updated successfully',
                statusCode: 200,
                data: updatedItem
            };
        }

        else {
            const newItem = await this.prisma.cartItem.create({
                data: {
                    productId,
                    cartId: cart.id,
                    quantity: 1,
                    unitPrice: product.price
                }
            });
            return {
                message: 'Item added to cart successfully',
                statusCode: 201,
                data: newItem
            };
        }
    }

    async removeFromCart(productId: number, userId: number) {
        //verificar se o productId é um número e positivo
        if (isNaN(productId) || productId <= 0) {
            return {
                message: 'Product ID must be a positive number',
                statusCode: 400
            }
        }
        
        const cart = await this.prisma.cart.findFirst({
            where: { userId }
        });

        if (!cart) {
            return {
                message: 'Cart not found',
                statusCode: 404
            }
        }

        const cartItem = await this.prisma.cartItem.findFirst({
            where: { productId, cartId: cart.id }
        });

        if (!cartItem) {
            return {
                message: 'Item not found in cart',
                statusCode: 404
            }
        }

        if (cartItem.quantity > 1) {
            const updatedItem = await this.prisma.cartItem.update({
                where: { id: cartItem.id },
                data: {
                    quantity: cartItem.quantity - 1
                }
            });
            return {
                message: 'Item quantity updated successfully',
                statusCode: 200,
                data: updatedItem
            };
        }

        else {
            const deletedItem = await this.prisma.cartItem.delete({
                where: { id: cartItem.id }
            });
            return {
                message: 'Item removed from cart successfully',
                statusCode: 200,
                data: deletedItem
            };
        }

        
        
        
    }

}