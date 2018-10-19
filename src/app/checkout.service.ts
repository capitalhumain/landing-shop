'use strict';
import { Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { Headers, RequestOptions } from '@angular/http';
import { CookieService } from 'ngx-cookie-service';

declare var $: any;

// Common data service
@Injectable()
export class CheckoutService {

constructor(
              private cookieService: CookieService ) {
}

    checkout(serviceName, cartItems) {

        return    this.checkoutPayPal( cartItems, serviceName);

    }

    private checkoutPayPal( cartItems, serviceName) {
      const allCookies: {} = this.cookieService.getAll();
      const scn = this.cookieService.get( 'scn');
        // global data
        const data = {
            cmd: '_cart',
            business: 'upclick',
            upload: '1',
            rm: '2',
            charset: 'utf-8'
        };

        // item data
        for (let i = 0; i < 1; i++) {
            const item = cartItems[i];
        }
        let customTracking = '';
         customTracking +='&key2=AQ_'+serviceName.Culture+'_IA_'+scn.toUpperCase();

        for (const tracking in serviceName.userParams) {
          if (serviceName.userParams.hasOwnProperty(tracking)) {
              customTracking = '&' + tracking + '=' + serviceName.userParams[tracking];
          }


        }
       if ( allCookies['gclid']) {
        const userdata = allCookies['gclid'].toString();
          customTracking += '&gclid=' + userdata;

        }
        if (allCookies['msclkid']) {
        const userdata = allCookies['msclkid'].toString();
          customTracking += '&utm_source=bing&utm_medium=cpc&msclkid=' + userdata;

        }
/*
        var rs = serviceName.userParams.rs2
        var sku =   cartItems[0].product.sku;
        var code =  serviceName.userParams.tobuy;
        var lang =   serviceName.userParams.culture;
        var version = serviceName.yourlicense;
        var mkey =  serviceName.userParams.mkey1;
        var uid = serviceName.userParams.uid;
        var key ='AQ_'+lang+'_IA_EXPDF_'+rs+'_'+code+'_FROM_'+version;
        if(version === '12_UPG'){
            key ='AQ_'+lang+'_IA_UPG_EXPDF_'+rs+'_'+code+'_FROM_'+version;
        }
        if(mkey=='AQ_FR_SEO_01_EXPDF'){
            key = mkey;
        }
 */
       const endPoint = serviceName.buy_link + '&culture=' + serviceName.Culture + customTracking;
      return endPoint;
    }


    private addFormFields(form, data) {
        if (data != null) {
            $.each(data, function (name, value) {
                if (value != null) {
                    const input = $('<input></input>').attr('type', 'hidden').attr('name', name).val(value);
                    form.append(input);
                }
            });
        }
    }
}
