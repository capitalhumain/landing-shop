import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Product } from '../shared/product.model';
import { CartService } from '../cart.service';
import { Subject, Subscription, Observable } from 'rxjs';
import { StoreActions } from '../actions'; // <- New
import { NgRedux, select } from '@angular-redux/store';
import { IAppState } from '../store';


@Component({
  selector: 'app-product-option',
  templateUrl: './product-option.component.html',
  styleUrls: ['./product-option.component.scss']
})
export class ProductOptionComponent implements OnInit {


    readonly options$: Observable<any>;
    options: {};

    constructor(private ngRedux: NgRedux<IAppState>, private actions: StoreActions, private cartService: CartService) {

      this.options$ = ngRedux.select<any>('features');



    }

    ngOnInit() {
         // this.options$.subscribe(confg => console.log(confg));
    }



}

