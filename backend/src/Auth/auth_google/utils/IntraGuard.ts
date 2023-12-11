import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
export class IntraAuthGuard extends AuthGuard('42')
{

}