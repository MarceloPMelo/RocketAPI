import { Injectable, HttpException, HttpStatus, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import axios, { AxiosError } from 'axios';

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
}
