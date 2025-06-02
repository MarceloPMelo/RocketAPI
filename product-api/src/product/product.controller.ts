import { Body, Controller, Post, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { Roles } from '../auth/roles.decorator';

@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Post('import')
    @Roles('ADMIN')
    async importarProdutos() {
        return this.productService.importarProdutos();
    }

    @Get()
    async getAllProducts() {
        return this.productService.getAllProducts();
    }

    @Get('search')
    async searchProducts(@Query('title') title: string) {
        return this.productService.searchProducts(title);
    }

    @Get(':id')
    async getProductById(@Param('id', ParseIntPipe) id: number) {
        return this.productService.getProductById(id);
    }
}
