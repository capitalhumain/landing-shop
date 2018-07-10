import { Component, EventEmitter, Input, Inject, enableProdMode, AfterViewInit, ViewChild, NgModule, OnInit } from '@angular/core';
import { Routes, Router } from '@angular/router';
import { ActivatedRoute, Params } from '@angular/router';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { NgRedux, select } from '@angular-redux/store';

import { IAppState } from './store';
import { ADD_TODO, REMOVE_TODO, TOGGLE_TODO, LOAD_TODO } from './actions';
import { ITodo } from './todo';

import { Product } from './shared/product.model';
import { DataService } from './data.service';
import { CartService } from './cart.service';

import { CartComponent } from './cart/cart.component';

 
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs/Subscription';


 
enableProdMode();

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
@select() products;

  model: ITodo ;

  //products: Product[];
  cartConfig: {};
  private _pdtSvc: DataService;
  allCookies = {} ;
  banner = "banner_PDF_12.jpg";
  tobuy: string
  cuture: string
  mkey1: string
  version: string
  rs2: string
  userParams: any = {} ;
  public apiUrl="http://cart.expert-pdf.com/appData12_UPG.cfm?culture=de&version=12&has=View_Create_Convert_Edit_Insert_Review_Secure_Forms";
  subscription; // <- New;
 @ViewChild('CartComponent')
 
 CartComponent: CartComponent;

  originalData: any = []
  
  constructor(private ngRedux: NgRedux<IAppState>, private _sanitizer: DomSanitizer, private ActiveRoute: ActivatedRoute, private cookieService: CookieService, private dataService: DataService, private cartService: CartService,@Inject(DataService) pdtSvc: DataService){ 
   
    this._pdtSvc = pdtSvc;

    let  userParams: any = {} ; 
    const allCookies: {} = cookieService.getAll();
    if(allCookies['CFCLIENT_EXPERTPDF']){
      let userdata = allCookies['CFCLIENT_EXPERTPDF'].toString().split('#');
      userdata.forEach(function(value){
      let keypair = value.split('=')
      if(keypair[1] ) userParams[keypair[0]] = keypair[1];
      
    });
  }
    
    this.userParams = userParams
    this.userParams['version'] = 12 ;
    this.userParams['tobuy'] = "home" ;
     
    this.ActiveRoute.queryParams.subscribe(
      // The 1st callback handles the data emitted by the observable.
      // In your case, it's the JSON data extracted from the response.
      // That's where you'll find your total property.
      (params: Params) => {
        let _queryParem = params;
         

         for(let key in _queryParem){
              this.cookieService.set( key, _queryParem[key] );
         }
        if(_queryParem['version'] && _queryParem['has'] && _queryParem['culture']){
                this.userParams['version'] = _queryParem['version'];
                this.userParams['tobuy']  = _queryParem['has'] ;
                this.userParams['culture']  = _queryParem['culture'] ;
                this.apiUrl = "http://cart.expert-pdf.com/appData"+this.userParams['version']+"_UPG.cfm?has="+this.userParams['tobuy']+"&culture="+this.userParams['culture'] ;
                this.onURLChange(this.apiUrl);    
        } 
        
      },
      // The 2nd callback handles errors.
      (err) => console.error(err),
      // The 3rd callback handles the "complete" event.
      () =>  console.info("done"),
     
    );


   }
    getBackground() {
      const bckgUrl = 'http://cart.expert-pdf.com/landingShop/images/fr/'+"banner_Expert_PDF_"+this.userParams['version']+".jpg";
      let urlimage = `url(${bckgUrl})`
        if(this.userParams['version'] && this.userParams['version'].toString().indexOf('10') > 1){
            urlimage = `max-width(100%),background-size(cover),url(${bckgUrl})`
         }
       return this._sanitizer.bypassSecurityTrustStyle(urlimage);
    }


   ngOnInit(){
   
       
  }

 obSubmit() {
    this.ngRedux.dispatch({type: ADD_TODO, todo: this.model});
  }

  toggleTodo(todo) {
    this.ngRedux.dispatch({ type: TOGGLE_TODO, id: todo.id });
  }

  removeTodo(todo) {
    this.ngRedux.dispatch({type: REMOVE_TODO, id: todo.id });
  }
 
   ngAfterViewChecked(): void {
     
     this.banner = "banner_Expert_PDF_"+this.userParams['version']+".jpg";
   }

  onURLChange(url){
    this.dataService.getRemoteData(url).subscribe(data => {
      this.originalData = data  
      this.cartConfig = this.originalData.config;
      this.cartConfig['userParams'] = this.userParams;
      var localProduct = this.originalData.products.slice(0) ;
      this.ngRedux.dispatch({type: LOAD_TODO, products: localProduct });
      this.cartService.flushCart()
    })
  }
}
