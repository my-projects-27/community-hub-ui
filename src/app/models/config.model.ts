export class Union{
    unionName: string="";
    unionNameLocal: string="";
}

export class Unit{
    unitName: string="";
    unitNameLocal: string="";
    branchId:number=0;
}

export class Branch{
    branchName: string="";
    branchNameLocal: string="";
    unionId: number=0;
}

export class CommonReference{
    code:string="";
    type:string="";
    value:string="";
    valueLocal:string="";
}

export class ConfigEntity{
    name:string="";
    nameLocal:string="";
    parentId:number=0;
    code:string="";
    type:string="";
}

export class CustomResponse{
    message:string[]=[];
    responseType:ResponseType=ResponseType.INFO;
}

export enum ResponseType{
    SUCCESS="SUCCESS",
    ERROR="ERROR",
    WARNING="WARNING",
    INFO="INFO",
}