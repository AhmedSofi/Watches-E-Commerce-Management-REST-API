
import {repository} from '@loopback/repository';
import {del, get, getModelSchemaRef, param, post, put, requestBody} from '@loopback/rest';
import {WatchModel} from '../models';
import {WatchRepository} from '../repositories/watch.repository';
export class WatchControllerController {
  constructor(
    @repository(WatchRepository)
    public watchRepository: WatchRepository,

  ) { }


  @get('/getWatchesAll', {
    responses: {
      '200': {
        description: 'Watch model instance',
        content: { 'application/json': { schema: { type: 'array', items: getModelSchemaRef(WatchModel) } } },
      },
    },
  })
  async find(
    @param.query.number('skip') skip: number = 0,
    @param.query.number('take') take: number = 10,
    @param.query.string('orderBy') orderBy: string = 'id:asc'
  ): Promise<any> {
    const [field, direction] = orderBy.split(':');
    const sortOrder = direction === 'desc' ? 'desc' : 'asc';

    return this.watchRepository.find(skip, take, { [field]: sortOrder });
  }


  async autoincrment(): Promise<number> {
    let watch = await this.watchRepository.findall();
    let id = 0;
    for (let i = 0; i < watch.length; i++) {
      id = Math.max(id, watch[i].id);
    }
    return id + 1;
  }


  @post('/addWatches', {
    responses: {
      '200': {
        description: 'Watch model instance',
        content: {'application/json': {schema: {type: 'array', items: {'x-ts-type': WatchModel}}}},
      },
    },
  })
  async create(@requestBody() watch: WatchModel[]): Promise<WatchModel[] | undefined> {
    if (Array.isArray(watch)) {
      for (let i = 0; i < watch.length; i++) {
        watch[i].id = await this.autoincrment();
      }

      return this.watchRepository.createAll(watch);

    }


  }

  //http://127.0.0.1:3000/getWatches?name={"model":"ss"}
  @get('/getWatches', {
    responses: {
      '200': {
        description: 'Watch model instance',
        content: {'application/json': {schema: getModelSchemaRef(WatchModel)}},
      },
    },
  })
  async getby(@param.query.object('name') name: any): Promise<WatchModel[]> {


    return this.watchRepository.getBy(name, WatchModel);
  }





  @put('/returnwatches', {
    responses: {
      '200': {
        description: 'Watch model instance',
        content: {'application/json': {schema: getModelSchemaRef(WatchModel)}},
      },
    },
  })
  async Retrievedeletedwatches(@requestBody() ides: number[]): Promise<void> {
    for (let i = 0; i < ides.length; i++) {
      let deletewatche = await this.watchRepository.findOne(ides[i]);
      if (deletewatche) {
        deletewatche['isActive'] = true;
      }
      this.watchRepository.update(ides[i], deletewatche);
    }
  }


  @put('/upatawatch', {
    responses: {
      '200': {
        description: 'Watch model instance',
        content: {'application/json': {schema: getModelSchemaRef(WatchModel)}},
      },
    },
  })
  async upatawatch(@requestBody() Watches: Partial<WatchModel>[]): Promise<string> {
    for (let i = 0; i < Watches.length; i++) {

      await this.watchRepository.update((Watches[i].id as number), Watches[i]);

    }
    return "updated";


  }




  @put('/updateWatchescategory', {
    responses: {
      '200': {
        description: 'Watch model instance',
        content: {'application/json': {schema: getModelSchemaRef(WatchModel)}},
      },
    },
  })
  async updateWatchescategory(@requestBody() data:{
    id:number,
    Categories:number[]
    removeCategories:number[]
  }[]): Promise<string> {
    for (let i = 0; i < data.length; i++) {
      this.watchRepository.updateCategories(data[i].id,data[i].Categories,data[i].removeCategories);
    }
    return "updated";

  }

  @put('/updateWatchOrderLines', {
    responses: {
      '200': {
        description: 'Watch model instance',
        content: {'application/json': {schema: getModelSchemaRef(WatchModel)}},
      },
    },
  })
  async updateWatchlines(@requestBody() data:{
    id:number,
    OrderLines:number[]
    removeOrderLines:number[]
  }[]): Promise<void> {

    for (let i = 0; i < data.length; i++)
    {
      this.watchRepository.updateWatchlines(data[i].id,data[i].OrderLines,data[i].removeOrderLines);
    }
  }



@del('/deleteWatches', {
    responses: {
      '200': {
        description: 'Watch model instance',
        content: {'application/json': {schema: getModelSchemaRef(WatchModel)}},
      },
    },
  })
  async deleteWatches(@requestBody() ides: number[]): Promise<void> {
    for (let i = 0; i < ides.length; i++) {
      let deletewatche = await this.watchRepository.findOne(ides[i]);
      if (deletewatche) {
        deletewatche['isActive'] = false;
      }
      this.watchRepository.update(ides[i], deletewatche);

    }
  }






}
