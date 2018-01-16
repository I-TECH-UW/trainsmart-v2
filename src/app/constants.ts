import { HttpHeaders } from '@angular/common/http';

export const BASEURL = 'http://localhost:8080';

const heads = new HttpHeaders();
heads.set('Content-Type', 'application/json');
heads.set('Access-Control-Allow-Origin', '*');

export const httpOptions = {
  headers: heads
};
