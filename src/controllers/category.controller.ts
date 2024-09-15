// Uncomment these imports to begin using these cool features!


import {repository} from '@loopback/repository';
import {Categorymodel} from '../models';
import {categoryRepository} from '../repositories/category.repository';
// import {get} from 'http';
import {del, get, getModelSchemaRef, param, patch, post, put, requestBody} from '@loopback/rest';
export class categorycontroller {
  constructor(
    @repository(categoryRepository)
    public categoryRepository: categoryRepository,

  ) { }


  @get('/getcategoryAll', {
    responses: {
      '200': {
        description: 'cate model instance',
        content: {'application/json': {schema: {type: 'array', items: getModelSchemaRef(Categorymodel)}}},
      },
    },
  })
  async find(
    @param.query.number('skip') skip: number = 0,
    @param.query.number('take') take: number = 10,
    @param.query.string('orderBy') orderBy: string = 'id:asc'
  ): Promise<any> {
    return this.categoryRepository.find( skip, take, { id: 'asc' });
  }

  async autoincrment(): Promise<number> {
    let cate = await this.categoryRepository.find();
    let id = 0;
    for (let i = 0; i < cate.length; i++) {
      id = Math.max(id, cate[i].id);
    }
    return id + 1;
  }

  @post('/addcategory', {
    responses: {
      '200': {
        description: 'Watch model instance',
        content: {'application/json': {schema: {type: 'array', items: {'x-ts-type': Categorymodel}}}},
      },
    },
  })
  async create(@requestBody() data: Categorymodel[]): Promise<Categorymodel[] | undefined> {
    if (Array.isArray(data)) {
      for (let i = 0; i < data.length; i++) {
        data[i].id = await this.autoincrment();
      }
      return this.categoryRepository.createall(data);

    }

  }

  @get('/getcategory', {
    responses: {
      '200': {
        description: 'Watch model instance',
        content: {'application/json': {schema: getModelSchemaRef(Categorymodel)}},
      },
    },
  })
  async getby(@param.query.object('name') name: Categorymodel): Promise<Categorymodel[]> {


    return this.categoryRepository.getBy(name,Categorymodel);
  }



  @put('/Retrievedeletedcategory', {
    responses: {
      '200': {
        description: 'Watch model instance',
        content: {'application/json': {schema: getModelSchemaRef(Categorymodel)}},
      },
    },
  })
  async Retrievedeletedwatches(@requestBody() ides: number[]): Promise<void> {
    for (let i = 0; i < ides.length; i++) {
      let del = await this.categoryRepository.findOne(ides[i]);
      if (del) {
        del['isActive'] = true;
      }
      this.categoryRepository.update(ides[i], del);
    }
  }


  @put('/upatacategory', {
    responses: {
      '200': {
        description: 'Watch model instance',
        content: {'application/json': {schema: getModelSchemaRef(Categorymodel)}},
      },
    },
  })
  async upatawatch(@requestBody() data: Partial<Categorymodel>[]): Promise<void> {
    for (let i = 0; i < data.length; i++) {

      await this.categoryRepository.update((data[i].id as number), data[i]);
    }


  }



  @del('/deleteWatches', {
    responses: {
      '200': {
        description: 'Watch model instance',
        content: {'application/json': {schema: getModelSchemaRef(Categorymodel)}},
      },
    },
  })
  async delete(@requestBody() ides: number[]): Promise<void> {

    for (let i = 0; i < ides.length; i++) {
      let deletewatche = await this.categoryRepository.findOne(ides[i]);
      if (deletewatche) {
        deletewatche['isActive'] = false;
      }
      this.categoryRepository.update(ides[i], deletewatche);
    }


  }













}
