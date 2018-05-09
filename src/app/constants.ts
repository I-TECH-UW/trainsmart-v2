import { HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';

export const BASEURL = environment.api_url;

const heads = new HttpHeaders();
heads.set('Content-Type', 'application/json');
heads.set('Access-Control-Allow-Origin', '*');

export const httpOptions = {
  headers: heads
};
