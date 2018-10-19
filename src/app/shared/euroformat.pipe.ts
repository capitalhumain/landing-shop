import { Pipe, PipeTransform } from '@angular/core';
@Pipe({  name: 'euroFormat' })
export class EuroFormatPipe implements PipeTransform {

    transform(value: Number, euroFormat: any = ''): any {
        let t = euroFormat + ' ' + value;
         if ((euroFormat === '€' || euroFormat ===  'CHF' ) && value) {
              value = (parseFloat(value.toString()) + 0.0001) ;
              t =  value.toFixed(2).toString().split('.').join(',') + ' ' + euroFormat;
         }
        return t;
    }
}

