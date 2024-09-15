import { repository } from '@loopback/repository';
import { del, get, getModelSchemaRef, param, patch, post, put, requestBody } from '@loopback/rest';
import { WatchOrderShipment } from '../models';
import { WatchordershipmentRepository } from '../repositories';

export class WatchordershipmentController {
  constructor(
    @repository(WatchordershipmentRepository)
    public watchordershipmentRepository: WatchordershipmentRepository,
  ) {}

  @get('/getWatchordershipmentsAll', {
    responses: {
      '200': {
        description: 'Watchordershipment model instance',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': WatchOrderShipment } },
          },
        },
      },
    },
  })
  async find(
    @param.query.number('take') take: number = 10,
    @param.query.number('skip') skip: number = 0,
    @param.query.string('orderBy') orderBy: string = 'id:asc'
  ): Promise<any> {
    const [field, direction] = orderBy.split(':');
    const sortOrder = direction === 'desc' ? 'desc' : 'asc'
    return this.watchordershipmentRepository.find(take, skip, { [field]: sortOrder });
  }

  async autoincrment(): Promise<number> {
    let shipments = await this.watchordershipmentRepository.find();
    let id = 0;
    for (let i = 0; i < shipments.length; i++) {
      id = Math.max(id, shipments[i].id);
    }
    return id + 1;
  }

  @post('/addWatchordershipments', {
    responses: {
      '200': {
        description: 'Watchordershipment model instance',
        content: {
          'application/json': {
            schema: { type: 'array', items: { 'x-ts-type': WatchOrderShipment } },
          },
        },
      },
    },
  })
  async create(@requestBody() shipment: WatchOrderShipment[]): Promise<WatchOrderShipment[] | undefined> {
    if (Array.isArray(shipment)) {
      for (let i = 0; i < shipment.length; i++) {
        shipment[i].id = await this.autoincrment();
      }
      return this.watchordershipmentRepository.createAll(shipment);
    }
  }

  // Fetch specific watchordershipments using search conditions
  @get('/getWatchordershipments', {
    responses: {
      '200': {
        description: 'Watchordershipment model instance',
        content: { 'application/json': { schema: getModelSchemaRef(WatchOrderShipment) } },
      },
    },
  })
  async getby(@param.query.object('search') search: WatchOrderShipment): Promise<WatchOrderShipment[]> {
    return this.watchordershipmentRepository.getBy(search, WatchOrderShipment);
  }

  @put('/RetrieveDeletedShipments', {
    responses: {
      '200': {
        description: 'Watchordershipment model instance',
        content: { 'application/json': { schema: getModelSchemaRef(WatchOrderShipment) } },
      },
    },
  })
  async retrieveDeletedShipments(@requestBody() ids: number[]): Promise<void> {
    for (let i = 0; i < ids.length; i++) {
      let deletedShipment = await this.watchordershipmentRepository.findOne(ids[i]);
      if (deletedShipment) {
        deletedShipment['isActive'] = true;
      }
      this.watchordershipmentRepository.update(ids[i], deletedShipment);
    }
  }

  @put('/updateShipment', {
    responses: {
      '200': {
        description: 'Watchordershipment model instance',
        content: { 'application/json': { schema: getModelSchemaRef(WatchOrderShipment) } },
      },
    },
  })
  async updateShipment(@requestBody() shipments: Partial<WatchOrderShipment>[]): Promise<void> {
    for (let i = 0; i < shipments.length; i++) {
      await this.watchordershipmentRepository.update(shipments[i].id as number, shipments[i]);
    }
  }
  @put('/updateupdateShipmentOrder', {
    responses: {
      '200': {
        description: 'Watchordershipment model instance',
        content: { 'application/json': { schema: getModelSchemaRef(WatchOrderShipment) } },
      },
    },
  })
  async updateShipmentOrder(@requestBody() data:{
    id:number,
    watchorder:number[],
    remove:number[]
  }[]): Promise<void> {
    for (let i = 0; i < data.length; i++) {
      await this.watchordershipmentRepository.updatewatchorder(data[i].id, data[i].watchorder, data[i].remove);
    }
  }

  @del('/deleteShipments', {
    responses: {
      '200': {
        description: 'Watchordershipment model instance',
        content: { 'application/json': { schema: getModelSchemaRef(WatchOrderShipment) } },
      },
    },
  })
  async delete(@requestBody() ids: number[]): Promise<void> {
    for (let i = 0; i < ids.length; i++) {
      let shipmentToDelete = await this.watchordershipmentRepository.findOne(ids[i]);
      if (shipmentToDelete) {
        shipmentToDelete['isActive'] = false;
      }
      this.watchordershipmentRepository.update(ids[i], shipmentToDelete);
    }
  }
}
