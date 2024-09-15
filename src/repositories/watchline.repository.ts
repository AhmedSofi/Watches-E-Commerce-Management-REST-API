import {inject} from '@loopback/core';
import {PrismaClient} from '@prisma/client';
import {WatchesdbDataSource} from '../datasources';
import {watch} from 'fs';

export class WatchlineRepository {
  private prisma: PrismaClient;

  constructor(
    @inject('datasources.watchesdb') private dataSource: WatchesdbDataSource, // Injecting the data source
  ) {
    this.prisma = new PrismaClient();
  }

  // Find all watchlines including Watch and WatchOrder
  async find(
    take: number = 10,
    skip: number = 0,
    orderBy: { [key: string]: 'asc' | 'desc' } = { id: 'asc' },
  ) {
    return this.prisma.watchline.findMany({
      take,
      skip,
      orderBy,
      include: {
        watch: true, // Include Watch details
        watchOrder: true, // Include WatchOrder details
      },
    });
  }

  // Find one watchline by ID, including Watch and WatchOrder
  async findOne(id: number) {
    return this.prisma.watchline.findUnique({
      where: { id },
      include: {
        watch: true, // Include Watch details
        watchOrder: true, // Include WatchOrder details
      },
    });
  }

  // Create multiple watchlines and connect to Watch and WatchOrder
  async createAll(data: any): Promise<any>
  {
    const createdWatchlines = await Promise.all(data.map(async (watchline: any) => {
      // Connect to Watch
      const watch = watchline.watch;
      delete watchline.watch;

      // Connect to WatchOrder
      const watchOrder = watchline.watchOrder;
      delete watchline.watchOrder;

      return this.prisma.watchline.create({
        data: {
          ...watchline,
          watch: {
            connect: { id: watch.id },
          },
          watchOrder: {
            connect: { id: watchOrder.id },
          },
        },
      });
    }));

    return createdWatchlines;

  }


  // Update a watchline by ID, updating Watch and WatchOrder if necessary

  async update(id: number, data: any): Promise<any> {
    // Fetch the watchline to ensure it exists
    const watchline = await this.prisma.watchline.findUnique({
      where: { id },
    });

    if (!watchline) {
      throw new Error('Watchline not found');
    }
    let updatedate:any = {};
    for(let key in data){
      if(key !== 'WatchId' && key !== 'WatchOrderId'){
        updatedate[key] = data[key];
      }
    }

    // Update the watchline
    return this.prisma.watchline.update({
      where: { id },
      data: {
        ...updatedate,
      },
    });

  }

  async updatewatch(id:number,watchid:number,remove:number)
  {
    const watchline = await this.prisma.watchline.findUnique({
      where: { id },
    });

    if (!watchline) {
      throw new Error('Watchline not found');
    }
    return this.prisma.watchline.update({
      where: { id },
      data: {
        watch: {
          connect: { id: watchid },
        },
      },
    });
  }


  // Delete a watchline by ID (soft delete by setting isActive to false)
  async delete(id: number) {
    let watchline = await this.prisma.watchline.findUnique({
      where: { id },
    });

    if (!watchline) {
      throw new Error('Watchline not found');
    }

    return this.prisma.watchline.update({
      where: { id },
      data: { isActive: false },
    });
  }

  // Execute raw SQL query
  async execute_sql(ex_sql: string, params: any): Promise<any> {
    return this.dataSource.execute(ex_sql, params);
  }

  // Get watchlines by search conditions
  async getBy(base_search: any, mod: any): Promise<any> {
    try {
      const keys = Object.keys(base_search);
      const conditions = keys.map(key => `${key} = ?`).join(' AND ');

      let sql = `SELECT * FROM watchline WHERE ${conditions}`;
      let params = keys.map(key => base_search[key]);

      return await this.execute_sql(sql, params);
    } catch (error) {
      console.error('Error executing SQL query:', error);
      throw new Error(`Failed to execute query on ${mod}: ${error.message}`);
    }
  }
}
