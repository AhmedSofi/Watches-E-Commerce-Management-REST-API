import {Entity, model, property} from '@loopback/repository';

@model()
export class WatchOrderShipment extends Entity {
  @property({
    type: 'number',
    id: true,
    required: true,
  })
  id: number;

  @property({
    type: 'string',
    required: true,
  })
  trackingNumber: string;

  @property({
    type: 'number',
    required: true,
  })
  version: number;

  @property({
    type: 'date',
    default: () => new Date(),
  })
  addedAt?: string;

  @property({
    type: 'date',
    defaultFn: 'now',
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
  WatchOrders: number[];


  constructor(data?: Partial<WatchOrderShipment>) {
    super(data);
  }
}

export interface WatchOrderShipmentRelations {
  // describe navigational properties here
}

export type WatchOrderShipmentWithRelations = WatchOrderShipment & WatchOrderShipmentRelations;
