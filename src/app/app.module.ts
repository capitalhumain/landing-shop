import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'
// COMPONENTS
import { AppComponent } from './app.component';
import { StoreComponent } from './store/store.component';
import { StorePriceComponent } from './store-price/store-price.component';
import { CartComponent } from './cart/cart.component';
import { ProductOptionComponent } from './product-option/product-option.component';
import { CartPreviewComponent } from './cart-preview/cart-preview.component';
// PIPES
import { OrderByPipe } from './shared/orderby.pipe';
import { EuroFormatPipe } from './shared/euroformat.pipe';
import { EuroFormatDiscountPipe } from './shared/euroformatdiscount.pipe';
// SERVICES
import { DataService } from './data.service';
import { CartService } from './cart.service';
import { CheckoutService } from './checkout.service';
import { WindowRef } from './windows.service';
import { CookieService } from 'ngx-cookie-service';
// MODULES
import { ToastyModule } from 'ng2-toasty';
// ROUTE
import { routes, routing } from './app.routing';
// REDUX
import { NgReduxModule, NgRedux, DevToolsExtension } from '@angular-redux/store'; // <- Changed
import { IAppState, rootReducer, INITIAL_STATE } from './store';
import { StoreActions } from './actions';

// adding rx operators
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/finally';
import 'rxjs/add/observable/of';
import { DropdownComponent } from './dropdown/dropdown.component';


@NgModule({
  declarations: [
    AppComponent,
    StoreComponent,
    ProductOptionComponent,
    CartComponent,
    CartPreviewComponent,
    StorePriceComponent,
    OrderByPipe,
    EuroFormatPipe,
    EuroFormatDiscountPipe,
    DropdownComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    JsonpModule,
    routing,
    // Redux Module
    NgReduxModule,
    // Toasty added to imports
    ToastyModule.forRoot()
  ],
  providers: [
    DataService,
    CartService,
    CheckoutService,
    CookieService,
    StoreActions,
    WindowRef,
    CartComponent,

        {
            provide: APP_BASE_HREF,
            useValue: '/' + (window.location.pathname.split('/')[1] || '')
        }

  ],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule {

    // Tell @angular-redux/store about our rootReducer and our initial state.
    // It will use this to create a redux store for us and wire up all the
    // events.
   constructor(
    ngRedux: NgRedux<IAppState>,
    devTools: DevToolsExtension) {

    const storeEnhancers = devTools.isEnabled() ?
      [ devTools.enhancer() ] :
      [];

    ngRedux.configureStore(
      rootReducer,
      INITIAL_STATE,
      [],
      storeEnhancers);
    }

}
