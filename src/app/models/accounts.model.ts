export class AccountHead{
    id!:number;
    code:string="";
    name:string="";
    nameLocal:string="";
    type:string="";
    familyTxnAllowed:boolean=false;
    createdBy:string="";
    createdDate!:Date;
    updatedBy:string="";
    updatedDate!:Date;
}

export class AccountSearchDto{
    id:number=0;
    code:string="";
    name:string="";
    type:string="";
    isFamilyTxnAllowed:string="";
    sortingCol:string="";
    sortOrder:string="";
    pageSize:number=10;
    offset:number=0;
}