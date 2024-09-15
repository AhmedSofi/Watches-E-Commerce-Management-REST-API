import {inject} from '@loopback/core';
import {WatchesdbDataSource} from '../datasources';
import {PrismaClient} from '@prisma/client';
export class categoryRepository {
  private prisma: PrismaClient;

  // constructor() {
  //   this.prisma = new PrismaClient();

  // }

  constructor(
    @inject('datasources.watchesdb') private dataSource: WatchesdbDataSource, // Injecting the data source
  ) {
    this.prisma = new PrismaClient();
  }


  async find(
    skip: number = 0,
    take: number = 10,
    orderBy: { [key: string]: 'asc' | 'desc' } = { id: 'asc' }
  ) {
    return this.prisma.category.findMany(
      {
        skip,
        take,
        orderBy,
        include: {
          watches: true,
        },
      }
    );
  }


  async findOne(id: number) {
    return this.prisma.category.findUnique({
      where: { id },
      include: {
        watches: true,
      },
    });
  }


  async createall(data: any): Promise<any> {
    const createdCategories = await Promise.all(data.map(async (category: any) => {
      return this.prisma.category.create({
        data: {
          id: category.id,
          description: category.description,
        },

      });
    }));
    return createdCategories;
  }

  async update(id: number, data: any): Promise<any> {
    // Fetch the category to ensure it exists
    const category = await this.prisma.category.findUnique({
      where: { id },
      // Optionally, include related data if needed
      // include: { watches: true },
    });

    if (!category) {
      throw new Error('Category not found');
    }

    // Prepare the data to update
    const updateData: any = {};

    // Apply only fields present in data
    for (const key in data) {
      if (key !== 'watches') { // Ensure we're not touching related watches
        updateData[key] = data[key];
      }
    }

    // Perform the update with basic category fields
    return this.prisma.category.update({
      where: { id },
      data: updateData,
    });
  }







  async execute_sql(ex_sql: string, params: any): Promise<any> {
    return this.dataSource.execute(ex_sql, params);

  }

  async getBy(base_search: any, mod: any): Promise<any> {
    try {

      const modelDefinition = mod.definition;


      const keys = Object.keys(base_search);


      const conditions = keys.map(key => `${key} = ?`).join(' AND ');

      let sql = `SELECT * FROM Category WHERE ${conditions}`;

      let params = keys.map(key => base_search[key]);

      return await this.execute_sql(sql, params);

    } catch (error) {
      console.error('Error executing SQL query:', error);

      throw new Error(`Failed to execute query on ${mod}: ${error.message}`);
    }
  }
}
