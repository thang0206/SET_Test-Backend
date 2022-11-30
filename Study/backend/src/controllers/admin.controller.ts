import { authenticate } from '@loopback/authentication';
import { authorize } from '@loopback/authorization';
import { inject } from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
  getJsonSchemaRef,
} from '@loopback/rest';
import _ from 'lodash';
import { PasswordHasherBindings } from '../keys';
import {Admin, Agency, User} from '../models';
import {AdminRepository, AgencyRepository, UserRepository} from '../repositories';
import { basicAuthorization } from '../services/authorization';
import { BcryptHasher } from '../services/hash.password';
import { validateCredentials, validateCredentialsAgency } from '../services/validator-service';

export class AdminController {
  constructor(
    @repository(AdminRepository)
    public adminRepository : AdminRepository,

    @repository(AgencyRepository)
    public agencyRepository : AgencyRepository,

    @repository(UserRepository)
    public UserRepository : UserRepository,
    
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public hasher: BcryptHasher,
  ) {}

  @post("/admins/createAdmin", {
    responses: {
      '200': {
        description: 'create, authorize admin',
        content: {'application/json': {schema: getModelSchemaRef(User)}},
      },
    },
  })
  async createAdmin(@requestBody() admin: User) {
    validateCredentials(_.pick(admin, ['email', 'password']), this.UserRepository);
    admin.roles = ["admin"]

    admin.password = await this.hasher.hashPassword(admin.password);
    const savedAdmin = await this.UserRepository.create(admin);
    return savedAdmin;
  }

  @authenticate('jwt')
  @authorize({allowedRoles: ['admin'], voters: [basicAuthorization]})
  @post('/admins/createAgency', {
    responses: {
      '200': {
        description: 'Admin create Agency',
        content: {
          schema: getJsonSchemaRef(Agency)
        }
      }
    }
  })
  async createAgency(@requestBody() agencyData: Agency) {
    await validateCredentialsAgency(_.pick(agencyData, ['email', 'password']), this.agencyRepository);
    agencyData.password = await this.hasher.hashPassword(agencyData.password)
    const savedAgency = await this.agencyRepository.create(agencyData);
    savedAgency.password = "******"
    return savedAgency;
  }

  @patch('/admins')
  @response(200, {
    description: 'Admin PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Admin, {partial: true}),
        },
      },
    })
    admin: Admin,
    @param.where(Admin) where?: Where<Admin>,
  ): Promise<Count> {
    return this.adminRepository.updateAll(admin, where);
  }

  @get('/admins/{id}')
  @response(200, {
    description: 'Admin model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Admin, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Admin, {exclude: 'where'}) filter?: FilterExcludingWhere<Admin>
  ): Promise<Admin> {
    return this.adminRepository.findById(id, filter);
  }

  @patch('/admins/{id}')
  @response(204, {
    description: 'Admin PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Admin, {partial: true}),
        },
      },
    })
    admin: Admin,
  ): Promise<void> {
    await this.adminRepository.updateById(id, admin);
  }

  @put('/admins/{id}')
  @response(204, {
    description: 'Admin PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() admin: Admin,
  ): Promise<void> {
    await this.adminRepository.replaceById(id, admin);
  }

  @del('/admins/{id}')
  @response(204, {
    description: 'Admin DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.adminRepository.deleteById(id);
  }
}
