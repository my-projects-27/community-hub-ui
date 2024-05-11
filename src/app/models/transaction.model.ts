export class Transaction {
    id!:number;
    accountName:string="";
    txnType:string="";
    txnDate:string="";
    amount!:number;
    transferType:string="CASH";
    txnRef:string="";
    familyCode:string="";
    familyName:string=""; 
    remarks:string="";
    status:string="PENDING";
    createdBy:string="";
    createdAt:string="";
    verifiedBy:string="";
    verifiedAt:string="";
    accountId!:number;
    familyTxnAllowed:boolean=false;
}

export class TransactionSearchDto{
    id!:number;
    txnType!:string;
    fromDate:string="";
    toDate:string="";
    txnRef:string="";
    familyCode:string="";
    familyName:string="";
    remarks:string="";
    newRemarks:string="";
    transferType!:string;
    status!:string;
    accountId!:number;
    accountName:string="";
    sortingCol:string="";
    sortOrder:string="";
    pageSize:number=10;
    offset:number=0;
    sameUserFilter:boolean=false;
}

export class TXnsProcessDto{
    transactionId!:number;
    status!:string; 
    remarks:string="";
}