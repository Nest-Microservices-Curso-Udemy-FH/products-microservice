import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma.service';
import { PaginationDto } from 'src/common';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    const product = await this.prisma.product.create({
      data: createProductDto,
    });
    return product;
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;

    const totalProduct = await this.prisma.product.count({
      where: { available: true },
    });
    const lastPage = Math.ceil(totalProduct / limit);
    return {
      data: await this.prisma.product.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: {
          available: true,
        },
      }),
      meta: {
        page,
        totalProduct,
        lastPage,
      },
    };
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: {
        id,
      },
    });

    if (!product)
      throw new NotFoundException(`Product with id #${id} not found`);

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: __, ...data } = updateProductDto;
    await this.findOne(id);

    return this.prisma.product.update({
      where: { id, available: true },
      data: data,
    });
    // return `This action updates a #${id} product`;
  }

  async remove(id: number) {
    await this.findOne(id);
    //* cuando son microservicios hay que considerar si en los microservicios que
    //* consumen product ya no lo utilizan para poder realizar una delete en la BDD
    //* caso contrario solo se deberia actualizar un estado
    /*return this.prisma.product.delete({
      where: { id },
    });*/

    return this.prisma.product.update({
      where: { id },
      data: {
        available: false,
      },
    });
  }
}
