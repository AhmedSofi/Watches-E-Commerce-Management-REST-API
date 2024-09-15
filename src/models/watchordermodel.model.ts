import {Entity, model, property} from '@loopback/repository';

@model()
export class WatchOrder extends Entity {
  @property({
    type: 'number',
    id: true,
    required: true,
  })
  id: number;

  @property({
    type: 'date',
    default: () => new Date(),
  })
  createdAt?: string;

  @property({
    type: 'date',
    defaultFn: 'now',
  })
  updatedAt?: string;

  @property({
    type: 'number',
    required: true,
  })
  customerId: number;

  @property({
    type: 'number',
    required: true,
  })
  watchordershipmentID: number;

  @property({
    type: 'string',
    required: true,
  })
  customerRef: string;

  @property({
    type: 'number',
    required: true,
  })
  version: number;

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
  Watchlines: number[];

  constructor(data?: Partial<WatchOrder>) {
    super(data);
  }
}

export interface WatchOrderRelations {
  // describe navigational properties here
}

export type WatchOrderWithRelations = WatchOrder & WatchOrderRelations;
