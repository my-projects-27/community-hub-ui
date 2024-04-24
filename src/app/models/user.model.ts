export class UserDetail{
    fullName:string="";
    email:string="";
    role:Role=Role.USER_READ;
    username:string="";
    authorities:{authority:string}[]=[];
}

export enum Role{
    USER_READ,USER_WRITE,ADMIN
}

export class LoginResponse{
    accessToken:string="";
    refreshToken:string="";
    user!:UserDetail;
}

export class LoginRequest{
    email:string="";
    password:string="";
}