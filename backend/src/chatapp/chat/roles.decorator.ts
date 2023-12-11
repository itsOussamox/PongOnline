import { SetMetadata } from "@nestjs/common"

export enum Role {
    Admin = 'admin',
}

export const ROLES_KEY = 'roles'

export const Roles = (...roles:Role[])=>{return SetMetadata(ROLES_KEY, roles)}
