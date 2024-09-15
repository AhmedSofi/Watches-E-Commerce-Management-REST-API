import {inject} from '@loopback/core';
import {PrismaClient} from '@prisma/client';
import {WatchesdbDataSource} from '../datasources';
export class customerRepository {
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
    return this.prisma.customer.findMany(
      {
        include: {
          WatchOrders: true,
        },
      }
    );
  }
  async findOne(id: number) {
    return this.prisma.customer.findUnique({
      where: {id},
      include: {
        WatchOrders: true,
      },
    });
  }
  async createall(data: any): Promise<any> {
    const createdCustomers = await Promise.all(data.map(async (customer: any) => {
      return this.prisma.customer.create({
        data: {
          id: customer.id,
          name: customer.name,
          version: customer.version,
          addedAt: customer.addedAt,
          updatedAt: customer.updatedAt,
          isActive: customer.isActive,

        },

      });
    }));
    return createdCustomers;
  }

  async update(id: number, data: any): Promise<any> {
    // Fetch the category to ensure it exists
    const customer = await this.prisma.customer.findUnique({
      where: {id},
      // Optionally, include related data if needed
      // include: { watches: true },
    });
    if (!customer) {
      throw new Error('Customer not found');
    }
    const updateData: any = {};


    for (const key in data) {
      if (key !== 'watches') {
        updateData[key] = data[key];
      }
    }
    return this.prisma.customer.update({
      where: {id},
      data: updateData,
    });


  }

  async addWatchOrder(customerId: number, watchOrderId: number[], removewatchOrderId: number[]): Promise<any> {
    const customer = await this.prisma.customer.findUnique({
      where: {id: customerId},
    });
    if (!customer) {
      throw new Error('Customer not found');
    }
    const watchOrders = await this.prisma.watchOrder.findMany({
      where: {
        id: {
          in: watchOrderId,
        },
      },
    });
    if (watchOrders.length !== watchOrderId.length) {
      throw new Error('Some watchOrders not found');
    }
    return this.prisma.customer.update({
      where: {id: customerId},
      data: {
        WatchOrders: {
          connect: watchOrderId.map((id) => ({id})),
          disconnect: removewatchOrderId.map((id) => ({id})),
        },
      },
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

      let sql = `SELECT * FROM customer WHERE ${conditions}`;

      let params = keys.map(key => base_search[key]);

      return await this.execute_sql(sql, params);

    } catch (error) {
      console.error('Error executing SQL query:', error);

      throw new Error(`Failed to execute query on ${mod}: ${error.message}`);
    }
  }

}






