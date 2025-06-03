import { Body, Controller, Post, Get, Param, ParseIntPipe, Query, Put, Delete, BadRequestException } from '@nestjs/common';
import { ProductService } from './product.service';
import { Roles } from '../auth/roles.decorator';
import { ProductDto } from './create-product.dto';

/**
 * Controller responsável por gerenciar as operações de produtos
 */
@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    /**
     * Retorna todos os produtos cadastrados
     * @returns Lista de produtos
     */
    @Get()
    async getAllProducts() {
        return this.productService.getAllProducts();
    }

    /**
     * Busca produtos pelo título
     * @param title - Termo para buscar no título do produto
     * @returns Lista de produtos que contêm o termo no título
     */
    @Get('search')
    async searchProducts(@Query('title') title: string) {
        return this.productService.searchProducts(title);
    }

    /**
     * Busca produtos por seus IDs
     * @param ids - Lista de IDs dos produtos separados por vírgula (ex: 1,2,3)
     * @returns Lista de produtos encontrados e lista de IDs não encontrados
     */
    @Get('ids')
    async getProductById(@Query('ids') ids: string) {
        if (!ids) {
            throw new BadRequestException('IDs parameter is required');
        }

        // Converte a string de IDs em um array de números
        const productIds = ids.split(',')
            .map(id => parseInt(id.trim()))
            .filter(id => !isNaN(id));

        if (productIds.length === 0) {
            throw new BadRequestException('No valid IDs provided');
        }

        return this.productService.getProductById(productIds);
    }

    /**
     * Cria um novo produto
     * @param data - Dados do novo produto
     * @returns Produto criado
     * @role ADMIN - Apenas administradores podem criar produtos
     */
    @Post()
    @Roles('ADMIN')
    async createProduct(@Body() data: ProductDto) {
        return this.productService.createProduct(data);
    }

    /**
     * Importa produtos da API externa (FakeStoreAPI)
     * @returns Informações sobre a importação
     * @role ADMIN - Apenas administradores podem importar produtos
     */
    @Post('import')
    @Roles('ADMIN')
    async importarProdutos() {
        return this.productService.importarProdutos();
    }

    /**
     * Atualiza um produto existente
     * @param id - ID do produto a ser atualizado
     * @param data - Dados do produto para atualização
     * @returns Produto atualizado
     * @role ADMIN - Apenas administradores podem atualizar produtos
     */
    @Put(':id')
    @Roles('ADMIN')
    async updateProduct(@Param('id', ParseIntPipe) id: number, @Body() data: ProductDto) {
        return this.productService.updateProduct(id, data);
    }

    /**
     * Remove um produto do sistema
     * @param id - ID do produto a ser removido
     * @returns Mensagem de sucesso
     * @role ADMIN - Apenas administradores podem deletar produtos
     */
    @Delete(':id')
    @Roles('ADMIN')
    async deleteProduct(@Param('id', ParseIntPipe) id: number) {
        return this.productService.deleteProduct(id);
    }
}
