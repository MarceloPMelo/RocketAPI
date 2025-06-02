import { Body, Controller, Post, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { Auth } from 'src/auth/auth.decorator'; // Usar Auth() para proteger a rota

@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Post('import')
    async importarProdutos() {
        return this.productService.importarProdutos();
    }

    @Get()
    @Auth()
    async getAllProducts() {
        return this.productService.getAllProducts();
    }

    @Get('search')
    @Auth()
    async searchProducts(@Query('title') title: string) {
        return this.productService.searchProducts(title);
    }

    @Get(':id')
    @Auth()
    async getProductById(@Param('id', ParseIntPipe) id: number) {
        return this.productService.getProductById(id);
    }
}
