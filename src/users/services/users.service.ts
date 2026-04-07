import { Injectable, NotFoundException  } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { UsersEntity } from '../entities/users.entity';
import { UserDTO, UserToProjectDTO, UserUpdateDTO } from '../dto/user.dto';
import { UpdateResult } from 'typeorm/browser';
import { DeleteResult } from 'typeorm/browser';
import { ErrorManager } from 'src/utils/error.manager';
import { UsersProjectsEntity } from '../entities/usersProjects.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UsersEntity)
        private readonly usersRepository: Repository<UsersEntity>,
        @InjectRepository(UsersProjectsEntity)
        private readonly userProjectRepository: Repository<UsersProjectsEntity>,
    ){
        //NodeJS.ProcessEnv
    }            
    
    public async createUser(body: UserDTO): Promise<UsersEntity> {
        try {                        
            const salt = parseInt(process.env.HASH_SALT as string, 10);
            body.password = await bcrypt.hash(body.password, salt);
            
            return await this.usersRepository.save(body);
        } catch (error) {
            throw ErrorManager.createSignatureError(error instanceof Error ? error.message : String(error),);
        }
    }

    public async findUsers(): Promise<UsersEntity[]> {
        try {
            const users: UsersEntity[] = await this.usersRepository.find();
            if(users.length === 0){
                throw new ErrorManager({
                    type:'BAD_REQUEST',
                    message:'No se encontro resultado'
                })
            }
            return users;
        } catch (error) {
            throw ErrorManager.createSignatureError(error instanceof Error ? error.message : String(error),);
        }
    }

    public async findUserById(id: string): Promise<UsersEntity> {
        try {
            const user : UsersEntity | null = await this.usersRepository
            .createQueryBuilder('user')
            .where('user.id = :id', { id })
            .leftJoinAndSelect('user.projectsIncludes', 'projectsIncludes')
            .leftJoinAndSelect('projectsIncludes.project', 'project')
            .getOne();

            if (!user) {
                throw new ErrorManager({
                        type:'BAD_REQUEST',
                        message:'No se encontro resultado'
                })
            }

            return user;
        } catch (error) {
            throw ErrorManager.createSignatureError(error instanceof Error ? error.message : String(error),);
        }
        
    }

    public async updateUser(body: UserUpdateDTO, id: string): Promise<UpdateResult | undefined> {
        try {
             const user: UpdateResult = await this.usersRepository
        .update(id, body);

        if (user.affected === 0) {
            throw new ErrorManager({
                    type:'BAD_REQUEST',
                    message:'No se pudo actualizar'
            });
        }

        return user;

        } catch (error) {
          throw ErrorManager.createSignatureError(error instanceof Error ? error.message : String(error),);
        }              
    }

    public async deleteUser(id: string): Promise<DeleteResult | undefined> {
        try {
             const user: DeleteResult = await this.usersRepository
        .delete(id);

        if (user.affected === 0) {
             throw new ErrorManager({
                    type:'BAD_REQUEST',
                    message:'No se pudo eliminar'
            })
        }

        return user;

        } catch (error) {
          throw ErrorManager.createSignatureError(error instanceof Error ? error.message : String(error),);
        }              
    }

    public async relationProject(body: UserToProjectDTO) {
        try {
            return await this.userProjectRepository.save(body);
        } catch (error) {
            throw ErrorManager.createSignatureError(error instanceof Error ? error.message : String(error),);
        }
    }

    public async findBy({key, value}:{
        key: keyof UserDTO;
        value: any
    }){
        try {
            const user: UsersEntity | null = await this.usersRepository
            .createQueryBuilder('user')
            .addSelect('user.password')
            .where(`user.${String(key)} = :value`, { value })
            .getOne();
   
            return user;
        } catch (error) {
            throw ErrorManager.createSignatureError(error instanceof Error ? error.message : String(error),);
        }
    }

}
