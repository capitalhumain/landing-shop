import { Component, EventEmitter, OnInit, Inject, ViewChild, Input, NgModule, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CheckoutService } from '../checkout.service';
import { CartService } from '../cart.service';
import { Subscription } from 'rxjs/Subscription';
 

const OFFSET_HEIGHT: number = 170
const PRODUCT_HEIGHT: number = 48

@Component({
  selector: 'cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  @Input() cartConfig: {}
  products: any[] = []
  numProducts: number = 0
  animatePlop: boolean = false
  animatePopout: boolean = false
  expanded: boolean = false
  expandedHeight: string
  cartTotal: number = 0
  private _router: Router;
  cktSvc: CheckoutService;
   
  changeDetectorRef: ChangeDetectorRef
  

  constructor(private cartService: CartService, changeDetectorRef: ChangeDetectorRef, @Inject(CheckoutService)cktSvc: CheckoutService, @Inject(Router) router: Router) {
    this.changeDetectorRef = changeDetectorRef;
    this._router = router;
    this.cktSvc = cktSvc;
  }

  ngOnInit() {
     
    this.cartService.productAdded$.subscribe(data => {
      this.products = data.products;
      this.cartTotal = data.cartTotal;
      this.numProducts = data.products.reduce((acc, product) => {
        acc+=product.quantity
        return acc
      }, 0)
      this.changeDetectorRef.detectChanges()
    })
  }

  deleteProduct(product){
    this.cartService.deleteProductFromCart(product)
  }

  onCartClick(){
    this.expanded = !this.expanded
  }
  // checkout the shopping cart.
  checkout() {
         
        var endPoint = this.cktSvc.checkout(this.cartConfig, this.products);
        console.log(endPoint);
        (<any>window).dataLayer.push({
          event: 'pageView',
          action: 'addToCart',
          });
        //window.location.href = endPoint; 
  };
}
