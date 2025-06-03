import { Injectable, HttpException, HttpStatus, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import axios, { AxiosError } from 'axios';
import { ProductDto } from './create-product.dto';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async importarProdutos() {
    try {
      const response = await axios.get('https://fakestoreapi.com/products');
      const produtos = response.data;

      if (!Array.isArray(produtos) || produtos.length === 0) {
        throw new HttpException('Nenhum produto encontrado na API externa', HttpStatus.NOT_FOUND);
      }

      let produtosImportados = 0;
      let produtosExistentes = 0;

      for (const produto of produtos) {
        try {
          // Validação básica dos dados
          if (!produto.id || !produto.title || !produto.price) {
            console.error(`Produto inválido: ${JSON.stringify(produto)}`);
            continue;
          }

          // Verifica se já existe
          const existente = await this.prisma.product.findUnique({
            where: { id: produto.id },
          });

          if (!existente) {
            await this.prisma.product.create({
              data: {
                id: produto.id,
                title: produto.title,
                price: produto.price,
                description: produto.description || '',
                category: produto.category || 'Sem categoria',
                image: produto.image || '',
                rate: produto.rating?.rate || 0,
                count: produto.rating?.count || 0,
              },
            });
            produtosImportados++;
          } else {
            produtosExistentes++;
          }
        } catch (error) {
          console.error(`Erro ao processar produto ${produto.id}:`, error);
          continue;
        }
      }

      return {
        mensagem: 'Importação concluída',
        detalhes: {
          importados: produtosImportados,
          existentes: produtosExistentes,
          total: produtos.length
        }
      };

    } catch (error) {
      if (error instanceof AxiosError) {
        throw new HttpException(
          `Erro ao acessar API externa: ${error.message}`,
          HttpStatus.BAD_GATEWAY
        );
      }
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Erro interno ao importar produtos');
    }
  }

  async getAllProducts() {
    const products = await this.prisma.product.findMany();
    return {
      message: 'Products retrieved successfully',
      statusCode: 200,
      data: products
    };
  }

  async searchProducts(title: string) {
    if (!title) {
      return {
        message: 'Title parameter is required',
        statusCode: 400
      };
    }

    const products = await this.prisma.product.findMany({
      where: {
        title: {
          contains: title.toLowerCase()
        }
      }
    });

    return {
      message: 'Products found successfully',
      statusCode: 200,
      data: products
    };
  }

  async getProductById(ids: number[]) {
    const products = await this.prisma.product.findMany({
      where: {
        id: {
          in: ids
        }
      }
    });

    if (products.length === 0) {
      return {
        message: 'No products found',
        statusCode: 404
      };
    }

    // Verifica se algum ID não foi encontrado
    const foundIds = products.map(p => p.id);
    const notFoundIds = ids.filter(id => !foundIds.includes(id));

    return {
      message: 'Products found successfully',
      statusCode: 200,
      data: {
        products,
        notFoundIds: notFoundIds.length > 0 ? notFoundIds : undefined
      }
    };
  }

  async updateProduct(id: number, data: ProductDto) {

    if (!id) {
      return {
        message: 'Product not found',
        statusCode: 404
      };
    }
    if (isNaN(id) || id < 0) {
      return {
        message: 'Invalid ID',
        statusCode: 400
      };
    }

    const product = await this.prisma.product.update({
      where: { id },
      data
    });
    return product;
  }

  async deleteProduct(id: number) {
    if (!id) {
      return {
        message: 'Product not found',
        statusCode: 404
      };
    }
    if (isNaN(id) || id < 0) {
      return {
        message: 'Invalid ID',
        statusCode: 400
      };
    }
    await this.prisma.product.delete({
      where: { id }
    });
    return { message: 'Product deleted successfully' };
  }

  async createProduct(data: ProductDto) {
    // Encontra o maior ID atual e incrementa
    const maxId = await this.prisma.product.findFirst({
      orderBy: {
        id: 'desc'
      }
    });

    const nextId = (maxId?.id || 0) + 1;

    const product = await this.prisma.product.create({
      data: {
        id: nextId,
        title: data.title,
        description: data.description,
        image: data.image,
        price: data.price,
        count: data.count,
        category: data.category,
        rate: data.rate
      }
    });
    return product;
  }
}
