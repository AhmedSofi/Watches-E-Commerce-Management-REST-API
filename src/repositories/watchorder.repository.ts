import { inject } from '@loopback/core';
import { PrismaClient } from '@prisma/client';
import { WatchesdbDataSource } from '../datasources';

export class WatchOrderRepository {
  private prisma: PrismaClient;

  constructor(
    @inject('datasources.watchesdb') private dataSource: WatchesdbDataSource, // Injecting the data source
  ) {
    this.prisma = new PrismaClient();
  }

  // Find all watch orders including Watchlines, Customer, and Watchordershipment

  async find(
    skip: number = 0,
    take: number = 10,
    orderBy: { [key: string]: 'asc' | 'desc' } = { id: 'asc' }
  ) {
    return this.prisma.watchOrder.findMany({

      include: {
        Watchlines: true,
        customer: true,
        watchordershipment: true,
      },
    });
  }

  // Find one watch order by ID, including Watchlines, Customer, and Watchordershipment
  async findOne(id: number) {
    return this.prisma.watchOrder.findUnique({
      where: { id },
      include: {
        Watchlines: true,
        customer: true,
        watchordershipment: true,
      },
    });
  }

  // Create a new watch order and connect related entities
  async create(data: any): Promise<any> {
    // Ensure customerId is present
    if (!data.customerId) {
      throw new Error('Missing required field: customerId');
    }

    // Validate if customerId exists
    const customerExists = await this.prisma.customer.findUnique({
      where: { id: data.customerId },
    });

    if (!customerExists) {
      throw new Error('Customer with the given id does not exist');
    }

    // Prepare update data by excluding Categories and Watchlines
    let updateData: any = {};
    for (let key in data) {
      if (key !== 'customerId' && key !== 'watchordershipmentID') {
        updateData[key] = data[key];
      }
    }


    return this.prisma.watchOrder.create({
      data: {
        ...updateData,
        customer: {
          connect: { id: data.customerId },
        },
        watchordershipment: {
          connect: { id: data.watchordershipmentID },
        },
      },
    });
  }



  // Update a watch order by ID, updating Watchlines and other fields
  async update(id: number, data: any): Promise<any> {
    // Fetch the watch order to ensure it exists
    const watchOrder = await this.prisma.watchOrder.findUnique({
      where: { id },
    });

    if (!watchOrder) {
      throw new Error('Watch Order not found');
    }

    // Update the watch order
    return this.prisma.watchOrder.update({
      where: { id },
      data: {
        // Basic fields
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        customerRef: data.customerRef,
        version: data.version,
        isActive: data.isActive,

        // Relationships
        customer: {
          connect: { id: data.customerId },
        },
        watchordershipment: {
          connect: { id: data.watchordershipmentID },
        },

      },
      include: {
        customer: true,
        watchordershipment: true,

      },
    });
  }

  async updatewatchline(id: number, watchline: number[], remove: number[]): Promise<any> {
    // Fetch the watch order to ensure it exists
    const watchOrder = await this.prisma.watchOrder.findUnique({
      where: { id },
    });

    if (!watchOrder) {
      throw new Error('Watch Order not found');
    }

    // Update the watch order
    return this.prisma.watchOrder.update({
      where: { id },
      data: {
        Watchlines: {
          connect: watchline.map((watchline: any) => ({ id: watchline })),
          disconnect: remove.map((watchline: any) => ({ id: watchline })),
        },
      },
    });
  }



  // Execute raw SQL query
  async execute_sql(ex_sql: string, params: any): Promise<any> {
    return this.dataSource.execute(ex_sql, params);
  }

  // Get watch order by base search conditions
  async getBy(base_search: any, mod: any): Promise<any> {
    try {
      const keys = Object.keys(base_search);
      const conditions = keys.map(key => `${key} = ?`).join(' AND ');

      let sql = `SELECT * FROM watchorder WHERE ${conditions}`;
      let params = keys.map(key => base_search[key]);

      return await this.execute_sql(sql, params);

    } catch (error) {
      console.error('Error executing SQL query:', error);
      throw new Error(`Failed to execute query on ${mod}: ${error.message}`);
    }
  }
}
