import { Injectable } from '@angular/core';
import { DataTableParams } from 'angular5-data-table';

@Injectable()
export class SharedService {

  constructor() { }

  /**
   * Return date string into the format of YYYY/MM/DD
   * @param value
   */
  prepareDate(value: string): string {
    const dt = new Date(value);
    return dt.getFullYear() + '-' + (dt.getMonth() + 1) + '-' + dt.getDate();
  }

  paramsToQueryString(params: DataTableParams) {
    let result = [];
  
    if (params.offset != null) {
        result.push(['_start', params.offset]);
    }
    if (params.limit != null) {
        result.push(['_limit', params.limit]);
    }
    if (params.sortBy != null) {
        result.push(['_sort', params.sortBy]);
    }
    if (params.sortAsc != null) {
        result.push(['_order', params.sortAsc ? 'ASC' : 'DESC']);
    }
  
    return result.map(param => param.join('=')).join('&');
  }

}
