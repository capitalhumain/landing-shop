import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Product } from '../shared/product.model'
import { CartService } from '../cart.service';
import { Subject, Observable, Subscription } from 'rxjs/Rx';
import { NgRedux, select } from '@angular-redux/store';
import { IAppState } from '../store';
import { ADD_TODO, REMOVE_TODO, TOGGLE_TODO, SELECTED} from '../actions';

@Component({
  selector: 'product-option',
  templateUrl: './product-option.component.html',
  styleUrls: ['./product-option.component.scss']
})
export class ProductOptionComponent implements OnInit {

  	@Input() cartConfig: {};
   	productOption: Product ;
     optionRows: any ;
    @Output() updateEmployee = new EventEmitter<any> (); 
    readonly products$: Observable<any>; // <- New// <- Changed

    constructor(private ngRedux: NgRedux<IAppState>, private cartService: CartService) {
      this.products$ = ngRedux.select<any>('todos') // <- New
  	}

  	ngOnInit() {
      this.setConfigOptions()
   
  	}
   setConfigOptions= function () {
     let options = this.cartConfig.options;
     let optionsRowsConfig = []
     let optionsConfig = []
     let productsHandler = this.products$;
      
      productsHandler.subscribe(products =>
              products.forEach( function (product) {
                 optionsRowsConfig.push({options:product.id,product:product.options})  
          })
        );
      options.forEach( function (item, index) {
       
         optionsConfig.push({itemOption:item,row:[
                    optionsRowsConfig[0].product[index],
                    optionsRowsConfig[1].product[index],
                    optionsRowsConfig[2].product[index],
                    optionsRowsConfig[3].product[index]]
                    });
           

      });
       this.optionRows = optionsConfig;
    };
     
}
