import {Component, Inject, enableProdMode, OnInit, OnDestroy, AfterViewChecked} from '@angular/core';

import {Routes, Router, ActivatedRoute, Params, NavigationEnd} from '@angular/router';
import {DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
import {NgRedux, select} from '@angular-redux/store';
import {Subscription} from 'rxjs/Subscription';
import {Observable} from 'rxjs/Observable';

import {IAppState} from './store';
import {StoreActions} from './actions';
import {Product} from './shared/product.model';
import {CartConfig} from './shared/cartConfig.model';
import {DataService} from './data.service';
import {CartService} from './cart.service';
import {CartComponent} from './cart/cart.component';
import {CookieService} from 'ngx-cookie-service';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/combineLatest';

enableProdMode();

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit, OnDestroy, AfterViewChecked {
  currentUrl: string;
  currentStep: string;
  optionsData: any = [];

  allCookies = {};
  banner = 'banner_PDF_12.jpg';
  public userParams = {version: '12', has: 'converter', tobuy: 'converter', culture: 'fr', scn: 'ups'};
  public urlParams = {};
  productsHandler: Product[];
  public apiUrl = 'https://avanquestcdn.s3.amazonaws.com/www-docs/prod/lp.avanquest.com/UPSELL';
  readonly products$: Observable<any>;
  private subscriptions = new Subscription();

  private CartComponent: CartComponent;
  public cartConfig: CartConfig ;
  private _productService: DataService;
  private _cartService: CartService;
  originalData: any = [];

  constructor(private ngRedux: NgRedux<IAppState>,
              private actions: StoreActions,
              private _sanitizer: DomSanitizer,
              private activeRoute: ActivatedRoute,
              private cookieService: CookieService,
              @Inject(CartService) cartService: CartService,
              @Inject(DataService) productService: DataService,
              private router: Router) {

    // MAP services to local
    this._productService = productService;
    this._cartService = cartService ;
    // load in store url params
    this.readUrlParams();
    console.log("constructor");



  }


  private async  readUrlParams() {
    console.log("readUrlParams");
     this.activeRoute.queryParams.subscribe(
        params => this.LoadConfig(params)
    );
  }

  private async  LoadConfig(params) {
console.log({LoadConfig:params});
    const obj = Object.keys(params).length;
    if ( obj > 0  ) {
      this.ngRedux.dispatch(this.actions.loadParams( [params] ) );
    }
  }

  private findCurrentStep(currentRoute) {
    const currRouteFragments = currentRoute.split('/');
    const length = currRouteFragments.length;
    this.currentStep = currentRoute.split('/')[length - 1];
  }

  getBackground() {
    const bckgUrl = 'http://cart.expert-pdf.com/landingShop/images/fr/' + 'banner_Expert_PDF_' + this.userParams['version'] + '.jpg';
    let urlimage = `url(${bckgUrl})`;
    if (this.userParams['version'] && this.userParams['version'].toString().indexOf('10') > 1) {
      urlimage = `max-width(100%),background-size(cover),url(${bckgUrl})`;
    }
    return this._sanitizer.bypassSecurityTrustStyle(urlimage);
  }


  ngOnInit() {

    // Combine them both into a single observable
    const urlParams = Observable.combineLatest(
      this.activeRoute.params,
      this.activeRoute.queryParams,
      (params, queryParams) => ({...params, ...queryParams})
    );

    // Subscribe to the single observable, giving us both
    urlParams.subscribe(routeParams => {
      // routeParams containing both the query and route params
      console.log({routeParams:routeParams});
      if ( routeParams.version) {
        this.setConfigStore(routeParams);
      }

    });


    const urlparams = this.ngRedux.select<any>('params');
    urlparams.subscribe(
      url_params =>  this.setuserParams(url_params), // this.userParams = url_params,
      error => console.log('Error: ', error),
      () => console.log(this.userParams)
    );



  }
  setuserParams(_userParams) {
    this.userParams = Object.assign(this.userParams, _userParams);

  }

  setConfigStore(urlRouteParams) {

    if (urlRouteParams) {
      const version = urlRouteParams.version ;
      console.log({setConfigStore: urlRouteParams});
      switch (version) {
        case "12":
          this.apiUrl = 'https://avanquestcdn.s3.amazonaws.com/www-docs/prod/lp.avanquest.com/UPSELL';
          break;

        default:
          this.apiUrl = 'https://avanquestcdn.s3.amazonaws.com/www-docs/prod/lp.avanquest.com/UPGRADE';
          break;
      }

      this._productService.getRemoteData(this.apiUrl).subscribe((data: any) => {
        this.originalData = data },
        error => console.log('Error: ', error),
        () => this.setProductStore()
      );

    }

  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  setProductStore() {


   console.log({setProductStore: this.userParams});

    const productsHandler = this.originalData.filter(home => (
      home.UserHas.toLowerCase() === this.userParams.has.toLowerCase() &&
      home.Culture.toLowerCase() === this.userParams.culture.toLowerCase()
    ));
console.log({productsHandler: productsHandler});
    this.ngRedux.dispatch(this.actions.loadProducts(productsHandler, this.userParams.culture.toLowerCase()));

    let cartConfig = [ ] ;
    cartConfig.push( {userParams : this.userParams} );

    if (this.userParams.scn === 'ups') {
      console.log({userParamssetProductStore: this.userParams});
      cartConfig = this.originalData.filter(home => (
        home.UserHas.toLowerCase() === this.userParams.has.toLowerCase() &&
        home.Culture.toLowerCase() === this.userParams.culture.toLowerCase()
      ));
    } else {
      cartConfig = this.originalData.filter(home => (
        home.UserHas.toLowerCase() === this.userParams.has.toLowerCase() &&
        home.UserWantsToBuy.toLowerCase() === this.userParams.has.toLowerCase() &&
        home.Culture.toLowerCase() === this.userParams.culture.toLowerCase()
      ));

    }
    console.log({cartConfig:cartConfig});

    const cartConfigData = [];
    cartConfigData.push(cartConfig[0]);
    this.ngRedux.dispatch(this.actions.loadCartConfig([cartConfigData]));
    this.cartConfig = cartConfigData[0];
    this._cartService.flushCart();
    this._cartService.addProductToCart(productsHandler[0]);

    const urlOption = 'https://avanquestcdn.s3.amazonaws.com/www-docs/prod/lp.avanquest.com/' + this.userParams.culture.toUpperCase();
    this._productService.getRemoteData(urlOption).subscribe(
      optionsData => this.ngRedux.dispatch(this.actions.loadOptions(optionsData)),
      error => console.log('Error: ', error),
      // () => console.info(this.urlParams)//this.ngRedux.dispatch(this.actions.loadOptions(this.optionsData))
    );
  }

  ngAfterViewChecked(): void {

    this.banner = 'banner_Expert_PDF_' + this.userParams['version'] + '.jpg';
  }

  /* onURLChange(): void {
    let originalDataHandler = [] ;
    this._productService.getRemoteData(this.apiUrl).subscribe((data: any) => {

       originalDataHandler = data;

      const productsHandler = data.filter(home => (
        home.UserHas.toLowerCase() === this.userParams['tobuy'] &&
        home.Culture.toLowerCase() === this.userParams['culture']
      ));
      this.ngRedux.dispatch(this.actions.loadProducts(productsHandler, this.userParams['culture']));

      const cartConfig = data.filter(home => (
        home.UserHas.toLowerCase() === this.userParams['tobuy'] &&
        home.UserWantsToBuy.toLowerCase() === this.userParams['tobuy'] &&
        home.Culture.toLowerCase() === this.userParams['culture']
      ));

      const cartConfigData = [];
      cartConfig[0].userParams = this.userParams;
      cartConfigData.push(cartConfig[0]);
      this.ngRedux.dispatch(this.actions.loadCartConfig([cartConfigData]));
      this.cartConfig = cartConfigData[0];
      this._cartService.flushCart();

    });

    this.originalData =  originalDataHandler ;

    const urlOption = 'https://avanquestcdn.s3.amazonaws.com/www-docs/prod/lp.avanquest.com/' + this.userParams['culture'].toUpperCase();

    this._productService.getRemoteData(urlOption).subscribe(optionsData => {

      this.ngRedux.dispatch(this.actions.loadOptions(optionsData));

    });
  }*/
}
