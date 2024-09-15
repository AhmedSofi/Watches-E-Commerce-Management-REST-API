import {repository} from '@loopback/repository';
import {del, get, getModelSchemaRef, param, patch, post, put, requestBody} from '@loopback/rest';
import {watchline} from '../models';
import {WatchlineRepository} from '../repositories';

export class watchlineController {
  constructor(
    @repository(WatchlineRepository)
    public watchlineRepository: WatchlineRepository,
  ) { }

  // Get all watchlines
  @get('/getwatchlineAll', {
    responses: {
      '200': {
        description: 'Array of watchline model instances',
        content: {'application/json': {schema: {type: 'array', items: getModelSchemaRef(watchline)}}},
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
    return this.watchlineRepository.find(
      take,
      skip,
      { [field]: sortOrder }
    );
  }

  // Auto-increment ID for new watchlines
  async autoincrement(): Promise<number> {
    let watchlines = await this.watchlineRepository.find();
    let id = 0;
    for (let i = 0; i < watchlines.length; i++) {
      id = Math.max(id, watchlines[i].id);
    }
    return id + 1;
  }

  // Create a new watchline
  @post('/addwatchlines', {
    responses: {
      '200': {
        description: 'watchline model instance',
        content: {'application/json': {schema: getModelSchemaRef(watchline)}},
      },
    },
  })
  async create(@requestBody() watchline: watchline[]): Promise<void> {
    for (let i = 0; i < watchline.length; i++) {
      watchline[i].id = await this.autoincrement();
      await this.watchlineRepository.createAll(watchline[i]);
    }
  }

  @put('/updatewatchline', {
    responses: {
      '200': {
        description: 'watchline PUT success',
        content: {'application/json': {schema: getModelSchemaRef(watchline)}},
      },
    },
  })
  async updateById(
    @requestBody() watchline: Partial<watchline>[],
  ): Promise<void> {
    for (let i = 0; i < watchline.length; i++) {
      await this.watchlineRepository.update(watchline[i].id as number, watchline[i]);
    }
  }

  @del('/deletewatchline', {
    responses: {
      '200': {
        description: 'watchline DELETE success',
        content: {'application/json': {schema: getModelSchemaRef(watchline)}},
      },
    },
  })
  async deleteById(
    @requestBody() id: number[]
  ): Promise<void> {
    for (let i = 0; i < id.length; i++) {
      let del = await this.watchlineRepository.findOne(id[i]);
      if (del) {
        del['isActive'] = false;
      }
      this.watchlineRepository.update(id[i], del);
    }
  }
  @get('/getwatchline', {
    responses: {
      '200': {
        description: 'watchline model instance',
        content: {'application/json': {schema: getModelSchemaRef(watchline)}},
      },
    },
  })
  async findById(
    @param.query.object('id') data: any
  ): Promise<any> {
    return this.watchlineRepository.getBy(data, watchline);
  }



}
