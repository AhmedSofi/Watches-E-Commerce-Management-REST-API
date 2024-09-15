import {Entity, model, property} from '@loopback/repository';

@model()
export class Categorymodel extends Entity {
  @property({
    type: 'number',
    id: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  description: string;

  @property({
    type: 'date',
    required: true,
  })
  createdAt: string;

  @property({
    type: 'date',
    required: true,
  })
  updatedAt: string;

  // @property({
  //   type: 'array',
  //   itemType: 'number',

  // })
  // watches?: number[];

  constructor(data?: Partial<Categorymodel>) {
    super(data);
  }
}

export interface CategorymodelRelations {
  // describe navigational properties here
}

export type CategorymodelWithRelations = Categorymodel & CategorymodelRelations;
