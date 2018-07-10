'use strict';
import { Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { Headers, RequestOptions } from '@angular/http';

declare var $: any;
// Common data service
@Injectable()
export class CheckoutService {
    

    checkout(serviceName, cartItems) {
         
        return    this.checkoutPayPal( cartItems,serviceName);
         
    }

    private checkoutPayPal( cartItems, serviceName) {
        console.log(cartItems)
        console.log(serviceName)
        // global data
        var data = {
            cmd: '_cart',
            business: 'upclick',
            upload: '1',
            rm: '2',
            charset: 'utf-8'
        };

        // item data
        for (var i = 0; i < 1; i++) {
            var item = cartItems[i];
        }

         

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

       var endPoint = "https://avanquest-store.upclick.com/clickgate/join/1030456/"+sku+'?mkey1='+key+'&culture='+lang+'&ref=expert-pdf.avanquest-store.upclick.com&phone=;0&uid='+uid;
       return endPoint;
    };


    private addFormFields(form, data) {
        if (data != null) {
            $.each(data, function (name, value) {
                if (value != null) {
                    var input = $('<input></input>').attr('type', 'hidden').attr('name', name).val(value);
                    form.append(input);
                }
            });
        }
    };
}