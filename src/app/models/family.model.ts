import { Transaction } from "./transaction.model";

export class Family{
    branchId:string="";
    familyId:string="";
    unitId!:string;
    unitName:String="";
    unitNameInLocal:String="";
    wardNumber:String="";
    bankWardNumber:String="";
    familyName:String="";
    familyNameLocal:String="";
    classification!:string;
    classificationLabel:String="";
    currentAddress:String="";
    currentAddressLocal:String="";
    permanentAddress:String="";
    permanentAddressLocal:String="";
    postOffice:String="";
    postOfficeLocal:String="";
    pinCode:String="";
    remarks:String="";
    createdBy:String="";
    updateBy:String="";
    createdDate:String="";
    updatedDate:String="";
    newFamily:boolean=true;
    members:Member[]=[];
    transactions:Transaction[]=[]    
}

export class Member{
    memberId:string="";
    relationWithPrimary:string="";
    name:string="";
    nameInLocal:string="";
    email:string="";
    dateOfBirth:string="";
    primaryNumber:string="";
    secondaryNumber:string="";
    whatsAppNumber:string="";
    presentLocation:string="";
    adhaarNumber:string="";
    bloodGroup:string="";
    isPrimary:boolean=false;
    modeOfContact:string="";
    isPrimaryContact:boolean=false;
    isPrimaryWhatsApp:boolean=false;
    createdBy:String="";
    updateBy:String="";
    createdDate:String="";
    updatedDate:String="";
    profession:string="";
}

export class FamilySearch{
    unitId:string="";
    familyName:string="";
    familyId:string="";
    classification:string="";
    wardNumber:string="";
    bankWardNumber:string="";
    postOffice:string="";
    pinCode:string="";
    address:string="";
    pageSize:number=10;
    offset:number=0;
    sortOrder:string="";
    sortBy:string="";
}

export class FamilyDue{
    id!:number;
    familyId!:string;
    accountId!:number;
    description:string="";
    date:string="";
    amount:number=0;
    createdBy:string="";
    createdAt:string="";
    familyName:string="";
    accountName:string="";
}

export class DuesSearchDto{
    familyId!:string;
    accountId!:number;
    description:string="";
    fromDate:string="";
    toDate:string="";
    accountName:string="";
    familyName:string="";
    pageSize:number=10;
    offset:number=0;
    sortBy:string="";
    sortOrder:string="";
}