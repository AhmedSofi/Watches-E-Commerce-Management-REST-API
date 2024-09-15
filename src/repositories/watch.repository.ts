import {inject} from '@loopback/core';
import {PrismaClient} from '@prisma/client';
import {WatchesdbDataSource} from '../datasources';

export class WatchRepository {
  private prisma: PrismaClient;

  constructor(
    @inject('datasources.watchesdb') private dataSource: WatchesdbDataSource, // Injecting the data source
  ) {
    this.prisma = new PrismaClient();
  }

  // Find all watches including Categories and Watchlines
  async find(
    skip: number = 0,
    take: number = 10,
    orderBy: { [key: string]: 'asc' | 'desc' } = { id: 'asc' }
  ) {
    return this.prisma.watch.findMany({
      skip,
      take,
      orderBy,
      include: {
        Categories: true,
        Watchlines: true,
      },
    });
  }

  async findall(

  ) {
    return this.prisma.watch.findMany({

      include: {
        Categories: true,
        Watchlines: true,
      },
    });
  }

  // Find one watch by ID, including Categories and Watchlines
  async findOne(id: number) {
    return this.prisma.watch.findUnique({
      where: { id },
      include: {
        Categories: true,
        Watchlines: true, // Include Watchlines
      },
    });
  }

  // Create multiple watches and connect valid categories and watchlines
  // async createAll(data: any): Promise<any> {
  //   const createdWatches = await Promise.all(data.map(async (watch: any) => {
  //     const validCategories = watch.Categories?.filter((category: any) => category.isActive) || [];

  //     // Filter Watchlines to include only active ones
  //     const activeWatchlines = watch.Watchlines?.filter((line: any) => line.isActive) || [];

  //     return this.prisma.watch.create({
  //       data: {
  //         id: watch.id,
  //         price: watch.price,
  //         model: watch.model,
  //         origin: watch.origin,
  //         serialNumber: watch.serialNumber,
  //         quantityOnHand: watch.quantityOnHand,
  //         isActive: watch.isActive,
  //         Categories: {
  //           connect: validCategories.map((category: any) => ({ id: category.id })),
  //         },
  //         Watchlines: {
  //           connect: activeWatchlines.map((line: any) => ({ id: line.id })),
  //         },
  //       },
  //     });
  //   }));

  //   return createdWatches;
  // }


  async createAll(data: any[]): Promise<any[]> {
    const createdWatches = await Promise.all(data.map(async (watch: any) => {
      return this.prisma.watch.create({
        data: {
          id: watch.id,
          price: watch.price,
          model: watch.model,
          origin: watch.origin,
          serialNumber: watch.serialNumber,
          quantityOnHand: watch.quantityOnHand,
          isActive: watch.isActive,

        },
      });
    }));

    return createdWatches;
  }


  async updateCategories(watchId: number, categoriesToAdd: number[], categoriesToRemove: number[]): Promise<void> {
    // Add categories to the watch
    for (let i = 0; i < categoriesToAdd.length; i++) {
      let category = await this.prisma.category.findUnique({
        where: { id: categoriesToAdd[i] },
      });
      if(!category) {
        throw new Error(`Category with ID ${categoriesToAdd[i]} not found`);
      }
      if(!category.isActive) {
        throw new Error(`Category with ID ${categoriesToAdd[i]} is not active`);
      }
      await this.prisma.watch.update({
        where: { id: watchId },
        data: {
          Categories: {
            connect: { id: categoriesToAdd[i] },
          },
        },
      });
    }

    for (let i = 0; i < categoriesToRemove.length; i++) {
      let category = await this.prisma.category.findUnique({
        where: { id: categoriesToRemove[i] },
      });
      if(!category) {
        throw new Error(`Category with ID ${categoriesToRemove[i]} not found`);
      }
      if(!category.isActive) {
        throw new Error(`Category with ID ${categoriesToRemove[i]} is not active`);
      }
      await this.prisma.watch.update({
        where: { id: watchId },
        data: {
          Categories: {
            disconnect: { id: categoriesToRemove[i] },
          },
        },
      });
    }

  }


  async updateWatchlines(watchId: number, watchlinesToAdd: number[], watchlinesToRemove: number[]): Promise<void> {
    for (let i = 0; i < watchlinesToAdd.length; i++) {
      let watchline = await this.prisma.watchline.findUnique({
        where: { id: watchlinesToAdd[i] },
      });
      if(!watchline) {
        throw new Error(`Watchline with ID ${watchlinesToAdd[i]} not found`);
      }
      if(!watchline.isActive) {
        throw new Error(`Watchline with ID ${watchlinesToAdd[i]} is not active`);
      }
      await this.prisma.watch.update({
        where: { id: watchId },
        data: {
          Watchlines: {
            connect: { id: watchlinesToAdd[i] },
          },
        },
      });
    }

    for (let i = 0; i < watchlinesToRemove.length; i++) {
      let watchline = await this.prisma.watchline.findUnique({
        where: { id: watchlinesToRemove[i] },
      });
      if(!watchline) {
        throw new Error(`Watchline with ID ${watchlinesToRemove[i]} not found`);
      }
      if(!watchline.isActive) {
        throw new Error(`Watchline with ID ${watchlinesToRemove[i]} is not active`);
      }
      await this.prisma.watch.update({
        where: { id: watchId },
        data: {
          Watchlines: {
            disconnect: { id: watchlinesToRemove[i] },
          },
        },
      });
    }

  }





  // Update a watch by ID, updating categories, watchlines, and other fields
  async update(id: number, data: any) {
    // Fetch the current watch without including relations like Categories or Watchlines
    let watch = await this.prisma.watch.findUnique({
      where: { id },
    });

    if (!watch) {
      throw new Error('Watch not found');
    }

    // Prepare update data by excluding Categories and Watchlines
    let updateData: any = {};
    for (let key in data) {
      if (key !== 'Categories' && key !== 'Watchlines') {
        updateData[key] = data[key];
      }
    }

    // Update the watch record without touching relations
    return this.prisma.watch.update({
      where: { id },
      data: updateData,
    });
  }


  // Execute raw SQL query
  async execute_sql(ex_sql: string, params: any): Promise<any> {
    return this.dataSource.execute(ex_sql, params);
  }

  // Get a specific watch order using base search conditions
  async getBy(base_search: any, mod: any): Promise<any> {
    try {



      const keys = Object.keys(base_search);
      const conditions = keys.map(key => `${key} = ?`).join(' AND ');

      let sql = `SELECT * FROM watch WHERE ${conditions}`;
      let params = keys.map(key => base_search[key]);


      return await this.execute_sql(sql, params);

    } catch (error) {
      console.error('Error executing SQL query:', error);
      throw new Error(`Failed to execute query on ${mod}: ${error.message}`);
    }
  }
}
