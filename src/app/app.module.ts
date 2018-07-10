import { BrowserModule } from '@angular/platform-browser';
import { NgModule , Inject} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
 
import { NgReduxModule } from '@angular-redux/store';
import { NgReduxRouterModule } from '@angular-redux/router';
import { NgRedux } from '@angular-redux/store'; // <- New
import { AppComponent } from './app.component';
 
import { StoreComponent } from './store/store.component';

import { CartComponent } from './cart/cart.component';
 
 
import { ProductOptionComponent } from './product-option/product-option.component';
import { CartPreviewComponent } from './cart-preview/cart-preview.component';
 
import { OrderByPipe } from './shared/orderby.pipe';
import { EuroFormatPipe } from './shared/euroformat.pipe';
import { DataService } from './data.service';
import { CartService } from './cart.service';
import { CheckoutService } from './checkout.service';
import { routes, routing } from './app.routing';
import { CookieService } from 'ngx-cookie-service';
import { ToastyModule } from 'ng2-toasty';

import { IAppState, rootReducer, INITIAL_STATE } from './store';

@NgModule({
  declarations: [
    AppComponent,
 
    StoreComponent,
    ProductOptionComponent,
    CartComponent,
 
    
    CartPreviewComponent,

    OrderByPipe,
    EuroFormatPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    JsonpModule,
    routing,
    // Redux Module
    NgReduxModule,
    // added to imports
    ToastyModule.forRoot()
  ],
  providers: [
    DataService,
    CartService,
    CheckoutService,
    CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
   constructor(ngRedux: NgRedux<IAppState>) {
    // Tell @angular-redux/store about our rootReducer and our initial state.
    // It will use this to create a redux store for us and wire up all the
    // events.
    ngRedux.configureStore(
      rootReducer,
      INITIAL_STATE);
  }
}
