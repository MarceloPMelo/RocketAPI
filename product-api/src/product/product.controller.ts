import { Body, Controller, Post } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './create-product.dto';

@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Post('import')
    async importarProdutos() {
        return this.productService.importarProdutos();
    }
}
