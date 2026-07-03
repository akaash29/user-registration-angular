import { HttpClient } from '@angular/common/http';
import { Injectable, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../types/user';

@Injectable({
  providedIn: 'root' // Makes the service a global singleton
})

export class UserService {
apiUrl="https://localhost:7104/api/user";

constructor(private http:HttpClient) { }


getUser=(id:number):Observable<User>=> this.http.get<User>(this.apiUrl+'/'+id);

addUser(data:User)
{
     const formData = new FormData();

    // Append regular text/number fields (automatically converted to strings)
    formData.append('firstName', data.firstName);
    formData.append('lastName', data.lastName);
    formData.append('email', data.email);
    data.skill.forEach((skill: string) => {
        formData.append('skill[]', skill);
        });
    formData.append('mobileNo', data.mobileNo.toString());
    formData.append('salary', data.salary.toString());
    formData.append('password', data.password.toString());

    // Append binary/file fields
    formData.append('cv', data.cv as Blob, data.cv.name);
    formData.append('photo', data.photo as Blob, data.photo.name);

    return this.http.post(this.apiUrl,formData);
}

}
