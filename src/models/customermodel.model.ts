import {Entity, model, property} from '@loopback/repository';

@model()
export class CustomerModel extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: false,
  })
  id: number;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'number',
    required: true,
  })
  version: number;

  @property({
    type: 'date',
    default: new Date(),
  })
  addedAt?: string;

  @property({
    type: 'date',
    defqault: 'now',
  })
  updatedAt?: string;

  @property({
    type: 'boolean',
    default: true,
  })
  isActive?: boolean;

  @property({
    type: 'array',
    itemType: 'number',
    required: true,
  })
  watchOrders: number[];






  constructor(data?: Partial<CustomerModel>) {
    super(data);
  }
}
