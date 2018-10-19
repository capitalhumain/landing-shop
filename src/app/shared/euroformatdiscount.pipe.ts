
import { Pipe, PipeTransform } from '@angular/core';
@Pipe({  name: 'euroFormatDiscount' })
export class EuroFormatDiscountPipe implements PipeTransform {

    transform(value: Number, euroFormat: any = ''): any {
        let t = euroFormat + ' ' + value;
         if ( (euroFormat === '€' || euroFormat === 'CHF') && value) {
           value = (parseFloat(value.toString()) + 0.0001) ;
             t =  value.toFixed().toString().split('.').join(',') + ' ' + euroFormat;
         }
        return t;
    }


}
