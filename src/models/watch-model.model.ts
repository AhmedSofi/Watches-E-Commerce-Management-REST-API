import {Entity, model, property} from '@loopback/repository';


@model()
export class WatchModel extends Entity {
  @property({
    type: 'number',
    id: true,
    required: true,
    generated: false,
  })
  id: number;

  @property({
    type: 'number',
    required: true,
  })
  price: number;

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
    type: 'string',
    required: true,

  })
  model: string;

  @property({
    type: 'string',
    required: true,
  })
  origin: string;

  @property({
    type: 'string',
    required: true,
  })
  serialNumber: string;

  @property({
    type: 'number',
    required: true,
  })
  quantityOnHand: number;

  @property({
    type: 'boolean',
    required: true,
    default: true,
  })
  isActive?: boolean;


  @property({
    type: 'array',
    itemType: 'number',

  })
  Categories?: number[];


  @property({
    type: 'array',
    itemType: 'number',

  })
  Watchlines?: number[];

  constructor(data?: Partial<WatchModel>) {
    super(data);
  }
}

export interface WatchModelRelations {
  // describe navigational properties here
}

export type WatchModelWithRelations = WatchModel & WatchModelRelations;
