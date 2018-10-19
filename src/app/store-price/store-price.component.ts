import { Inject, Component, OnInit, OnDestroy, Input, Output, ChangeDetectorRef,
   OnChanges, EventEmitter, ElementRef, HostListener, ViewChild, AfterViewInit} from '@angular/core';
import { ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../shared/product.model';
import { CartService } from '../cart.service';
import { Subject, Observable, Subscription } from 'rxjs';
import { NgRedux, select } from '@angular-redux/store';
import { IAppState } from '../store';
import { StoreActions} from '../actions';
 import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CheckoutService } from '../checkout.service'; // import { NgRedux, select } from '@angular-redux/store'; // <- Changed
  // import { Observable } from 'rxjs/Observable';
  import { DOCUMENT } from '@angular/platform-browser';
@Component({
  selector: 'app-store-price',
  templateUrl: './store-price.component.html',
  styleUrls: ['./store-price.component.scss']
})
export class StorePriceComponent implements  OnInit, OnDestroy {
    public fixed = false;
    @Input() cartConfig;
    product: Product;
    cartTotal: any ;
    readonly products$: Observable<any>; // <- New// <- Changed
    readonly config$: Observable<any>;
    private subscriptions = new Subscription();
    @Output() updateStore = new EventEmitter<any> ();
    rsprice: Number = 0;
    upSellDiff: Number = 0;
    upSellDiscount: Number = 0;
    private _router: Router;
    cktSvc: CheckoutService;
    changeDetectorRef: ChangeDetectorRef;

constructor(  public el: ElementRef,
                @Inject(DOCUMENT) private document: Document,
                  private ngRedux: NgRedux<IAppState>,
                  private actions: StoreActions,
                  private cartService: CartService,
                  changeDetectorRef: ChangeDetectorRef,
                  @Inject(CheckoutService)cktSvc: CheckoutService,
                  @Inject(Router) router: Router) {
    this.changeDetectorRef = changeDetectorRef;
    this._router = router;
    this.cktSvc = cktSvc;
    this.products$ = ngRedux.select<any>('products');
}

    @HostListener('window:scroll', [])
    onWindowScroll() {
       const target = this.el.nativeElement.querySelector('#prod-compare-prods').offsetTop;
       const targetHeigth = this.el.nativeElement.querySelector('#prod-compare-prods').offsetHeight;
       const num = this.document.documentElement.scrollTop || this.document.body.scrollTop || 0;

       if ( num > target + targetHeigth / 5) {
           this.fixed = true;
       } else if (this.fixed && num < 1 + target + targetHeigth / 5) {
           this.fixed = false;
       }
    }
  ngOnInit() {


      let selectedItem: Product;
      const datLayerHandler = [];
      let numberOfItem = 0 ;
      if (this.cartConfig.UserWantsToBuy) {
        const UserWantsToBuy = this.cartConfig.UserWantsToBuy ;

            this.products$.subscribe(
              products => {

                products.forEach( function (item, index) {
                  const datalayerProduct = {'brand': 'Expert-PDF', 'category': 'lp-dynamic-' +
                    item.Culture, 'id': item.id, 'name': item.name, 'price': item.price};

                    numberOfItem++;
                    if ( item.UserWantsToBuy === UserWantsToBuy) {
                       selectedItem = item;
                      }
                   datLayerHandler.push(datalayerProduct);
                });
                this.cartService.addProductToCart(selectedItem);
                this.cartTotal = this.cartService.cartTotal;
              }
            );
       }


     (<any>window).dataLayer.push({
        'ecommerce': {
          'click': {
            'actionField': {
              'list': numberOfItem + ' Products'
            },
            'products': datLayerHandler
          }
        },
        'event': 'productClick'

      });

   }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

   getUpSellDif = function(itemId) {
        let rsprice = 0 ;

        if (this.cartService.cartTotal) {
            const currentprice = this.cartService.cartTotal;


            this.products$.subscribe(products =>
                products.forEach( function (item) {

                if (item.id === itemId  ) {
                   rsprice = parseInt(item.price, 10) - parseInt(currentprice, 10);

                }
            })
          );
        }

        return rsprice.toFixed();
    };

    getUpSellDiscount = function (itemId) {
        let rsprice ;
        const currency = this.cartConfig.currencySymbol;
        if (this.cartService.cartTotal) {
          const currentprice = this.cartService.cartTotal;
          this.products$.subscribe(prods =>
             prods.forEach( function (item) {

                if (item.id === itemId ) {

                  const bestDiscount = parseInt(item.baseprice, 10) - parseInt(item.price, 10) ;
                    const discount = (( item.baseprice - item.price ) / item.baseprice) * 100;
                    // console.log({currentprice:currentprice;bestDiscount:bestDiscount,discount:discount})
                    if ( discount > bestDiscount ) {
                       rsprice =   discount.toFixed() + '%' ;
                    } else {

                        if (currency === '£') {
                            rsprice =  currency  + ' ' + (bestDiscount.toFixed());
                        } else {
                          rsprice =   (bestDiscount.toFixed()) + ' ' + currency;
                        }

                    }

                }
            })
          );
        }

         return rsprice;
    };


   onAddToCart(item) {
    // this.updateStore.emit(item.id);


    this.ngRedux.dispatch(this.actions.selected([item.id]));


    this.cartService.addProductToCart(item);
    this.cartTotal = this.cartService.cartTotal;
   }

    onProductClick(item) {
      this.actions.selected(item.id);
      // this.ngRedux.dispatch({type: SELECTED , id:item.id});
    }

    saveData(prod) {
      const indexId = [];
      indexId.push(prod);
      let selectedItem: Product;

      this.ngRedux.dispatch(this.actions.selected(indexId));
      this.products$.subscribe(products =>
      products.forEach(function (item, index) {

            if (item.id === prod) {
                item.tobuy = 1;

                selectedItem = item;
            } else {
                item.tobuy = 0;
            }
        })

      );
        document.getElementById('cart').scrollIntoView();

       this.cartService.addProductToCart(selectedItem);
      this.cartTotal = this.cartService.cartTotal;
    }

    checkout(prod) {

        const endPoint = this.cktSvc.checkout(this.cartConfig, prod);
        (<any>window).dataLayer.push({
          'ecommerce': {
            'add': {
              'products': [{
                'brand': 'Expert PDF',
                'category': this.cartConfig['UserWantsToBuy'],
                'id': this.cartConfig['id'],  // Required
                'name': this.cartConfig['name'],  // Required
                'price': this.cartConfig['price'],
                 'quantity': 1  // Required
              }]
            },
            'currencyCode': 'EUR'  // Required
          },
          'event': 'addToCart'  ,
          'eventCallback': function() {
            // Object.assign(document.createElement('a'), { target: '_blank', href: endPoint}).click();
            // window.location.assign(endPoint);
  window.open(endPoint, '_blank');

          }
        });

  }

}
