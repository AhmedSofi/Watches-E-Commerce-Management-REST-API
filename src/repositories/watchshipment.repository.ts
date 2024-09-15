import { inject } from '@loopback/core';
import { PrismaClient } from '@prisma/client';
import { WatchesdbDataSource } from '../datasources';

export class WatchordershipmentRepository {
  private prisma: PrismaClient;

  constructor(
    @inject('datasources.watchesdb') private dataSource: WatchesdbDataSource, // Injecting the data source
  ) {
    this.prisma = new PrismaClient();
  }

  // Find all watchordershipments including related WatchOrders
  async find(
    skip: number = 0,
    take: number = 10,
    orderBy: { [key: string]: 'asc' | 'desc' } = { id: 'asc' },
  ) {
    return this.prisma.watchordershipment.findMany({
      take,
      skip,
      orderBy,
      include: {
        WatchOrders: true, // Include WatchOrders
      },
    });
  }

  // Find one watchordershipment by ID, including related WatchOrders
  async findOne(id: number) {
    return this.prisma.watchordershipment.findUnique({
      where: { id },
      include: {
        WatchOrders: true, // Include WatchOrders
      },
    });
  }

  // Create multiple watchordershipments and connect valid WatchOrders
  async createAll(data: any): Promise<any> {
    const createdShipments = await Promise.all(
      data.map(async (shipment: any) => {
        return this.prisma.watchordershipment.create({
          data: {
            id: shipment.id, // Include the id property
            trackingNumber: shipment.trackingNumber,
            version: shipment.version,
            addedAt: shipment.addedAt,
            updatedAt: shipment.updatedAt,
            isActive: shipment.isActive,

          },
        });
      }),
    );

    return createdShipments;
  }

  // Update a watchordershipment by ID, updating WatchOrders and other fields
  async update(id: number, data: any): Promise<any> {
    // Fetch the shipment to ensure it exists
    const shipment = await this.prisma.watchordershipment.findUnique({
      where: { id },
    });

    if (!shipment) {
      throw new Error('Watch Order Shipment not found');
    }

    
    return this.prisma.watchordershipment.update({
      where: { id },
      data: {
        trackingNumber: data.trackingNumber,
        version: data.version,
        addedAt: data.addedAt,
        updatedAt: data.updatedAt,
        isActive: data.isActive,
      },
    });
  }

  async updatewatchorder(id: number, watchorder:number[],remove:number[]): Promise<any> {
    // Fetch the shipment to ensure it exists
    const shipment = await this.prisma.watchordershipment.findUnique({
      where: { id },
    });

    if (!shipment) {
      throw new Error('Watch Order Shipment not found');
    }

    // Update the shipment
    return this.prisma.watchordershipment.update({
      where: { id },
      data: {
        WatchOrders: {
          connect: watchorder.map((watchorder: any) => ({ id: watchorder })),
          disconnect: remove.map((watchorder: any) => ({ id: watchorder }))
        },
      },
    });
  }

  // Execute raw SQL query
  async execute_sql(ex_sql: string, params: any): Promise<any> {
    console.log('Executing SQL:', ex_sql, params);
    return this.dataSource.execute(ex_sql, params);
  }

  // Get a specific watch order shipment using base search conditions
  async getBy(base_search: any, mod: any): Promise<any> {
    try {
      const modelDefinition = mod.definition;

      const keys = Object.keys(base_search);
      const conditions = keys.map(key => `${key} = ?`).join(' AND ');

      let sql = `SELECT * FROM watchordershipment WHERE ${conditions}`;
      let params = keys.map(key => base_search[key]);

      console.log('SQL:', sql, params);
      return await this.execute_sql(sql, params);

    } catch (error) {
      console.error('Error executing SQL query:', error);
      throw new Error(`Failed to execute query on ${mod}: ${error.message}`);
    }
  }
}
