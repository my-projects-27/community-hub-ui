export class DropdownObject {
    id: string="";
    value: string="";
    valueLocal:string="";
    parentId:string="";
}

export class StaticDropdowns{
    classifications:DropdownObject[]=[];
    profession:DropdownObject[]=[];
    modeOfContact:DropdownObject[]=[];
    relationships:DropdownObject[]=[];
}
export const staticTypes:DropdownObject[]= [
    {id:"profession",value:"Profession",valueLocal:"",parentId:""},
    {id:"classifications",value:"Classifications",valueLocal:"",parentId:""},
    {id:"modeOfContact",value:"Mode of Contact",valueLocal:"",parentId:""},
    {id:"relationships",value:"Relationships",valueLocal:"",parentId:""},
];

export const bloodGroups:DropdownObject[]= [
    {id:"A+",value:"",valueLocal:"",parentId:""},
    {id:"A-",value:"",valueLocal:"",parentId:""},
    {id:"B+",value:"",valueLocal:"",parentId:""},
    {id:"B-",value:"",valueLocal:"",parentId:""},
    {id:"AB+",value:"",valueLocal:"",parentId:""},
    {id:"AB-",value:"",valueLocal:"",parentId:""},
    {id:"O+",value:"",valueLocal:"",parentId:""},
    {id:"O-",value:"",valueLocal:"",parentId:""},
]