import { Body, Controller, Post } from '@nestjs/common';
import { ProductService } from './product.service';
import { Auth } from 'src/auth/auth.decorator'; // Usar Auth() para proteger a rota

@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Post('import')
    async importarProdutos() {
        return this.productService.importarProdutos();
    }
}
