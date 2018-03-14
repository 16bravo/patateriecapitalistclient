import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http'
import { World, Pallier, Product } from './world';

@Injectable()
export class RestserviceService {
private server: string;
private user: string;

   constructor(private http: Http) {
     this.server = "http://localhost:8080/ISIS20.1.9/";
     this.user = "";
    }


   getUser() : string{
     return this.user;
   }

   setUser(_user: string){
     this.user = _user;
   }

   getServer() : string{
     return this.server;
   }

   private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
   }
   getWorld(): Promise<World> {
    return this.http.get(this.server + "webresources/generic/world")
    .toPromise().then(response =>response.json()).catch(this.handleError);
   };

}
