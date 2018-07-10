import { Pipe, PipeTransform } from '@angular/core';
@Pipe({  name: 'orderBy' })
export class OrderByPipe implements PipeTransform {

    transform(records: Array<any>, args?: any): any {
        
        if(!Array.isArray(records)) {return records;}
        else{
          
          return records.sort(function(a, b){
               return -1
          });

        }
    
    };
}