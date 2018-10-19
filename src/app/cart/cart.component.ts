import { Component, EventEmitter, OnInit, Inject, ViewChild, Input, NgModule, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CheckoutService } from '../checkout.service';
import { CartService } from '../cart.service';
import { Subscription } from 'rxjs/Subscription';


const OFFSET_HEIGHT = 170;
const PRODUCT_HEIGHT = 48;

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  @Input() cartConfig: {};
  products: any[] = [];
  numProducts = 0;
  animatePlop = false;
  animatePopout = false;
  expanded = false;
  expandedHeight: string;
  cartTotal = 0;
  private _router: Router;
  cktSvc: CheckoutService;

  changeDetectorRef: ChangeDetectorRef;


  constructor(private cartService: CartService, changeDetectorRef: ChangeDetectorRef,
    @Inject(CheckoutService)cktSvc: CheckoutService, @Inject(Router) router: Router) {
    this.changeDetectorRef = changeDetectorRef;
    this._router = router;
    this.cktSvc = cktSvc;
  }

  ngOnInit() {

    this.cartService.productAdded$.subscribe(data => {
      this.products = data.products;
      this.cartTotal = data.cartTotal;
      this.numProducts = data.products.reduce((acc, product) => {
        acc += product.quantity;
        return acc;
      }, 0);
      this.changeDetectorRef.detectChanges();
    });
  }

  public getOptions(prod) {

    return prod['bloc_new'].replace(/\n/g , '<br>');
  }

 deleteProduct(product) {
    this.cartService.deleteProductFromCart(product);
  }
  onCartClick() {
    this.expanded = !this.expanded;
  }
  // checkout the shopping cart.
  checkout() {
       const thisroute =  this._router;
        const endPoint = this.cktSvc.checkout(this.cartConfig, this.products);
        (<any>window).dataLayer.push({
          'ecommerce': {
            'add': {
              'products': [{
                'brand': 'Expert PDF',
                'category': this.cartConfig['UserWantsToBuy'],
                'id': this.cartConfig['id'],  // Required
                'name': this.cartConfig['name'].replace(/<[^>]+>/g, ''),  // Required
                'price': this.cartConfig['price'],
                 'quantity': 1  // Required
              }]
            },
            'currencyCode': 'EUR'  // Required
          },
          'event': 'addToCart'
           ,
          'eventCallback': function() {
            // Object.assign(document.createElement('a'), { target: '_blank', href: endPoint}).click();
             Object.assign(document.createElement('a'), { onclick: window.open(endPoint)}).click();
            // console.error('open');
            // window.parent.open(endPoint, '_blank');
           // thisroute.navigate(['/']).then(result =>  {window.location.href = endPoint; });

           }  // This value must not change. Required
        });

  }
}
