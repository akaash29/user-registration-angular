import { File } from "buffer";

export interface User{
    Id:number;
        firstName:string;
        lastName:string;
        email:string;
        mobileNo:number;
        salary:number;
        password:string;
        photo:File;
        cv:File;
        skill:[];
}