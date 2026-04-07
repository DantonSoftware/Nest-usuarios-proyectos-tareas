import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ACCESS_LEVEL_KEY, ADMIN_KEY, PUBLIC_KEY, ROLES_KEY } from 'src/constants/key-decorators';
import { ROLES } from 'src/constants/roles';
import { Request } from 'express';
import { UsersService } from 'src/users/services/users.service';

@Injectable()
export class AccessLevelGuard implements CanActivate {
   constructor(
      private readonly userService: UsersService,
      private readonly reflector: Reflector,
    ) {}
  async canActivate(
    context: ExecutionContext,
  ) {
    const isPublic = this.reflector.get<boolean>(
      PUBLIC_KEY,
      context.getHandler(),
    );

    if (isPublic) {
      return true;
    }

    const roles = this.reflector.get<Array<keyof typeof ROLES>>(
      ROLES_KEY,
      context.getHandler(),
    );

    const accessLevel = this.reflector.get<number>(
      ACCESS_LEVEL_KEY,
      context.getHandler(),
    );

    const admin = this.reflector.get<boolean>(
      ADMIN_KEY,
      context.getHandler(),
    );

    const req = context.switchToHttp().getRequest<Request>();

    const {roleUser, idUser} = req;

    if (roles === undefined) {
      if(!admin){
        return true;
      }else if (admin && roleUser === ROLES.ADMIN) {
        return true;
      } else {
        throw new UnauthorizedException('No tienes permisos para esta operación');
      }
    }

    if (roleUser === ROLES.ADMIN) {
      return true;
    }

    const user = await this.userService.findUserById(idUser);

    const userExistInProject = user.projectsIncludes.find((project) => project.project.id === req.params.projectId);

    if(userExistInProject === undefined){
      throw new UnauthorizedException('No formas parte del proyecto');
    }

    if ( accessLevel !== undefined && userExistInProject.accessLevel < accessLevel) {
      throw new UnauthorizedException(
        'No tienes el nivel de acceso requerido para esta operación',
      );
    }

    return true;
  }
}