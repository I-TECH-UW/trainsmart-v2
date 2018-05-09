import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent} from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { Router } from "@angular/router";

@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {

    constructor(private router:Router) {}
    
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if(req.headers.get('No-Auth') === "True"){
            return next.handle(req.clone());
        } 
        
        if(localStorage.getItem('userToken') != null){
            /* const clonedreq = req.clone({
                headers: req.headers.set('Authorization', 'Bearer ' + localStorage.getItem('userToken'))
            }); */
            //application/json, text/plain, */*
            const clonedreq = req.clone({
                setHeaders: {
                    'Authorization': `Bearer ${localStorage.getItem('userToken')}`
                }
            });
            return next.handle(clonedreq);
        }

        return next.handle(req.clone());
    }
}
