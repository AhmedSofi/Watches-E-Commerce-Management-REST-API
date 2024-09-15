import {Entity, model, property} from '@loopback/repository';


@model()
export class watchline extends Entity {
  @property({
    type: 'number',
    id: true,
    required: true,
    generated: false,
  })
  id: number;

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
    type: 'number',
    required: true,
  })
  orderQuantity: number;

  @property({
    type: 'number',
    required: true,
  })
  quantityallocated: number;

  @property({
    type: 'boolean',
    required: true,
  })
  isActive: boolean;

  @property({
    type: 'number',
    required: true,
  })
  WatchId: number;

  @property({
    type: 'number',
    required: true,
  })
  WatchOrderId: number;



  constructor(data?: Partial<watchline>) {
    super(data);
  }
}

export interface watchlineRelations {
  // describe navigational properties here
}

export type watchlineWithRelations = watchline & watchlineRelations;
