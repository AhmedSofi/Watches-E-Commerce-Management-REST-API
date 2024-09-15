import {repository} from '@loopback/repository';
import {del, get, getModelSchemaRef, param, patch, post, put, requestBody} from '@loopback/rest';
import {WatchOrder} from '../models';
import {WatchOrderRepository} from '../repositories';

export class WatchOrderController {
  constructor(
    @repository(WatchOrderRepository)
    public watchOrderRepository: WatchOrderRepository,
  ) { }

  // Get all watch orders
  @get('/getWatchOrderAll', {
    responses: {
      '200': {
        description: 'Array of WatchOrder model instances',
        content: {'application/json': {schema: {type: 'array', items: getModelSchemaRef(WatchOrder)}}},
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
    return this.watchOrderRepository.find(take, skip, { [field]: sortOrder });
  }

  // Auto-increment ID for new watch orders
  async autoincrement(): Promise<number> {
    let watchOrders = await this.watchOrderRepository.find();
    let id = 0;
    for (let i = 0; i < watchOrders.length; i++) {
      id = Math.max(id, watchOrders[i].id);
    }
    return id + 1;
  }

  // Create a new watch order
  @post('/addWatchOrders', {
    responses: {
      '200': {
        description: 'WatchOrder model instance',
        content: {'application/json': {schema: getModelSchemaRef(WatchOrder)}},
      },
    },
  })
  async create(@requestBody() watchOrder: WatchOrder[]): Promise<any> {
    for (let i = 0; i < watchOrder.length; i++) {
      watchOrder[i].id = await this.autoincrement();
    return this.watchOrderRepository.create(watchOrder[i]);
    }

  }

  // Get a specific watch order by search conditions
  @get('/getWatchOrder', {
    responses: {
      '200': {
        description: 'WatchOrder model instance',
        content: {'application/json': {schema: getModelSchemaRef(WatchOrder)}},
      },
    },
  })
  async getBy(@param.query.object('conditions') conditions: any): Promise<WatchOrder[]> {
    return this.watchOrderRepository.getBy(conditions, WatchOrder);
  }

  @put('/updateWatchline', {
    responses: {
      '200': {
        description: 'Update WatchOrder model instance',
        content: {'application/json': {schema: getModelSchemaRef(WatchOrder)}},
      },
    },
  })
  async updateWatchline(@requestBody() data: {
    id: number,
    watchline: number[],
    remove: number[]
  }[]): Promise<any> {
    for(let i = 0; i < data.length; i++) {
      await this.watchOrderRepository.updatewatchline(data[i].id, data[i].watchline, data[i].remove);
    }
  }

  // Retrieve deleted watch orders by their IDs
  @put('/retrieveDeletedWatchOrders', {
    responses: {
      '200': {
        description: 'Update WatchOrder model instances',
        content: {'application/json': {schema: getModelSchemaRef(WatchOrder)}},
      },
    },
  })
  async retrieveDeletedWatchOrders(@requestBody() ids: number[]): Promise<void> {
    for (let id of ids) {
      let watchOrder = await this.watchOrderRepository.findOne(id);
      if (watchOrder) {
        watchOrder.isActive = true;
        await this.watchOrderRepository.update(id, watchOrder);
      }
    }
  }

  // Update a watch order
  @put('/updateWatchOrder', {
    responses: {
      '200': {
        description: 'Update WatchOrder model instance',
        content: {'application/json': {schema: getModelSchemaRef(WatchOrder)}},
      },
    },
  })
  async update(@requestBody() watchOrders: Partial<WatchOrder>[]): Promise<void> {
    for (let watchOrder of watchOrders) {
      await this.watchOrderRepository.update(watchOrder.id as number, watchOrder);
    }
  }

  // Delete watch orders by their IDs
  @del('/deleteWatchOrders', {
    responses: {
      '200': {
        description: 'Update WatchOrder model instances to inactive',
        content: {'application/json': {schema: getModelSchemaRef(WatchOrder)}},
      },
    },
  })
  async delete(@requestBody() ids: number[]): Promise<void> {
    for (let id of ids) {
      let watchOrder = await this.watchOrderRepository.findOne(id);
      if (watchOrder) {
        watchOrder.isActive = false;

        await this.watchOrderRepository.update(id, watchOrder);
      }
    }
  }
}
