import {repository} from '@loopback/repository';
import {del, get, getModelSchemaRef, param, post, put, requestBody} from '@loopback/rest';
import {CustomerModel} from '../models';
import {customerRepository} from '../repositories/customer.repository';
export class customercontroller {
  constructor(
    @repository(customerRepository)
    public customerRepository: customerRepository,

  ) { }

  @get('/getcustomerAll', {
    responses: {
      '200': {
        description: 'customer model instance',
        content: {'application/json': {schema: {type: 'array', items: getModelSchemaRef(CustomerModel)}}},
      },
    },
  })
  async find(
    @param.query.number('skip') skip: number = 0,
    @param.query.number('take') take: number = 10,
    @param.query.string('orderBy') orderBy: string = 'id:asc'
  ): Promise<any> {
    return this.customerRepository.find( skip, take, { id: 'asc' });
  }

  async autoincrment(): Promise<number> {
    let customer = await this.customerRepository.find();
    let id = 0;
    for (let i = 0; i < customer.length; i++) {
      id = Math.max(id, customer[i].id);
    }
    return id + 1;
  }

  @post('/addcustomer', {
    responses: {
      '200': {
        description: 'Watch model instance',
        content: {'application/json': {schema: {type: 'array', items: {'x-ts-type': CustomerModel}}}},
      },
    },
  })
  async create(@requestBody() data: CustomerModel[]): Promise<CustomerModel[] | undefined> {
    if (Array.isArray(data)) {
      for (let i = 0; i < data.length; i++) {
        data[i].id = await this.autoincrment();
      }
      return this.customerRepository.createall(data);

    }

  }

  @get('/getcustomer', {
    responses: {
      '200': {
        description: 'Watch model instance',
        content: {'application/json': {schema: getModelSchemaRef(CustomerModel)}},
      },
    },
  })
  async findOne(@param.query.object('data') data: Partial<CustomerModel>): Promise<any> {
    return this.customerRepository.getBy(data,CustomerModel);
  }

  @put('/updatecustomerwatchorder',{
    responses: {
      '204': {
        description: 'Watch PUT success',
      },
    },
  })
  async updateWatchOrder(@requestBody() data: {
    id: number;
    WatchOrders: number[];
    removedWatchOrders: number[];
  }[]): Promise<any>
  {
    for (let i = 0; i < data.length; i++) {
      await this.customerRepository.addWatchOrder(data[i].id, data[i].WatchOrders,data[i].removedWatchOrders);
    }

  }

  @put('/updatecustomer', {
    responses: {
      '204': {
        description: 'Watch PUT success',
      },
    },
  })
  async updateById(
    @requestBody() data: Partial<CustomerModel>[],
  ): Promise<any> {
    for (let i = 0; i < data.length; i++) {
      await this.customerRepository.update((data[i].id as number), data[i]);
    }
  }

  @del('/deletecustomer', {
    responses: {
      '204': {
        description: 'Watch DELETE success',
      },
    },
  })
  async deleteById(@requestBody() ides: number[]): Promise<void> {
   for (let i = 0; i < ides.length; i++) {
    let del = await this.customerRepository.findOne(ides[i]);
    if (del) {
      del['isActive'] = false;
    }
    this.customerRepository.update(ides[i], del);
   }
  }

  @put('/Retrievedeletedcustomer', {
    responses: {
      '200': {
        description: 'Watch model instance',
        content: {'application/json': {schema: getModelSchemaRef(CustomerModel)}},
      },
    },
  })
  async Retrieve(@requestBody() ides: number[]): Promise<void> {
    for (let i = 0; i < ides.length; i++) {
      let del = await this.customerRepository.findOne(ides[i]);
      if (del) {
        del['isActive'] = true;
      }
      this.customerRepository.update(ides[i], del);
    }
  }

}
