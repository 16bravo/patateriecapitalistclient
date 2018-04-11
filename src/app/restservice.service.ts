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
  private setHeaders(user : string) : Headers {
    var headers = new Headers();
    headers.append("X-User",user);
    return headers;
  }

  getWorld(): Promise<World> {
    return this.http.get(this.server + "webresources/generic/world", {
      headers: this.setHeaders(this.user)})
      .toPromise().then(response =>
        response.json()).catch(this.handleError);
      };

      putProduct(product : Product): Promise<Response> {
        return this.http.put(this.server + "webresources/generic/product", product,
        { headers: this.setHeaders(this.user)} )
        .toPromise();
      };

      putManager(manager : Pallier): Promise<Response> {
        return this.http.put(this.server + "webresources/generic/manager", manager,
        { headers: this.setHeaders(this.user)} )
        .toPromise();
      };

    }
