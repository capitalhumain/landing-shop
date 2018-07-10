import { Inject, Component, OnInit, Input, Output, OnChanges, EventEmitter,ElementRef, HostListener, ViewChild, AfterViewInit} from '@angular/core';
import { Product } from '../shared/product.model'
import { CartService } from '../cart.service';
import { Subject, Observable, Subscription } from 'rxjs/Rx';
import { NgRedux, select } from '@angular-redux/store';
import { IAppState } from '../store';
import { ADD_TODO, REMOVE_TODO, TOGGLE_TODO, SELECTED} from '../actions';
 //import { NgRedux, select } from '@angular-redux/store'; // <- Changed
  //import { Observable } from 'rxjs/Observable';
  import { DOCUMENT } from "@angular/platform-browser";
@Component({
  selector: 'store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss'] 
})
export class StoreComponent implements OnInit {
    public fixed: boolean = false; 
  	//@Input() 
    product: Product;
  	@Input() cartConfig: {}
    cartTotal : any ;
    readonly products$: Observable<any>; // <- New// <- Changed
    count: number; // <- New
     
  @Output() updateStore = new EventEmitter<any> ();
  rsprice : Number = 0
  upSellDiff : Number = 0
  upSellDiscount : Number = 0

  	constructor( public el: ElementRef, @Inject(DOCUMENT) private document: Document, private ngRedux: NgRedux<IAppState>, private cartService: CartService) {
        this.products$ = ngRedux.select<any>('todos') // <- New
  	}

         @HostListener("window:scroll", [])
          onWindowScroll() {
             const target = this.el.nativeElement.querySelector('#prod-compare-prods').offsetTop;
           const targetHeigth = this.el.nativeElement.querySelector('#prod-compare-prods').offsetHeight;
             let num = this.document.documentElement.scrollTop || this.document.body.scrollTop || 0;
             
             if ( num > target+targetHeigth/5) {
                 this.fixed = true;
             }else if (this.fixed && num < 1+target+targetHeigth/5) {
                 this.fixed = false;
             }
          }   
  ngOnInit() {
        
      let selectedItem : Product;
       this.products$.subscribe(products => 
        products.forEach( function (item, index) {
            if( item.tobuy === 1){
               selectedItem = item
            }
          }));
            
     this.cartService.addProductToCart(selectedItem)
     this.cartTotal = this.cartService.cartTotal
     
         
   }
  
   ngAfterViewChecked(): void {
     
        
   }
   
   getUpSellDif = function(itemId) {
        let rsprice = 0 ;
        
        if(this.cartService.cartTotal){
            let currentprice = this.cartService.cartTotal;

            
            this.products$.subscribe(products =>
                products.forEach( function (item) {
                if(item.id === itemId && item.upsell == 1  ) {
                   rsprice = parseInt(item.price) - parseInt(currentprice);
                   
                }
            })
          );      
        }
        
        return rsprice
    };

    getUpSellDiscount = function (itemId) {
        let rsprice ;
        let currency =this.cartConfig.currencySymbol;
        if(this.cartService.cartTotal){
          let currentprice = this.cartService.cartTotal;
          this.products$.subscribe(prods =>
             prods.forEach( function (item) {
                if(item.id === itemId ) {
                  let bestDiscount = parseInt(item.baseprice) - parseInt(item.price) ;
                    if( bestDiscount < parseInt(item.discount)){
                       rsprice =   (item.discount) +'%' ;
                    }else{
                        rsprice =   (bestDiscount) + ' '+currency;
                    }
                    
                }
            })
          );  
        }

         return rsprice
    };


   onAddToCart(item){
    this.updateStore.emit(item.id);
    this.cartService.addProductToCart(item);
    this.ngRedux.dispatch({type: SELECTED , id:item.id});
   }

    onProductClick(item){
      this.ngRedux.dispatch({type: SELECTED , id:item.id});
    }

    saveData(prod) {
      
      let indexId = 0;
      let selectedItem : Product
      this.products$.subscribe(products =>
      products.forEach(function (item, index) {
       
            if(item.id === prod) {
                item.tobuy = 1;
                indexId = item.id
                selectedItem = item
            }else{
                item.tobuy = 0;
            }
        })
      );
        document.getElementById("cart").scrollIntoView();

       this.cartService.addProductToCart(selectedItem)
      this.cartTotal = this.cartService.cartTotal
    } 
  
  	trackByFn(index, item) {
  	  return item.id;
	  }
}
