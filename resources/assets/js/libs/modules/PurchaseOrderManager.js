/*
 * data = {
 *   order: {},
 *   details: {},
 *   invoices: {},
 *   invoices_delivery: {}
 * }
 */
var PurchaseOrderManager = function(data) {
    this.data = data;

    this.getInvoices = function() {
      var i, j, k;

      var invoices = this.data.invoices;
      var invoicesDelivery = this.data.invoices_delivery;
      // Get all invoice delivery items
      var items = this._getInvoiceDeliveryItems();
      var unit;
      var temp;
      // Get retur ratio
      var ratio;
      var invoiceDetail;

      for(i=0; i<items.length; i++) {
        // Get unites
        unit = items[i].satuan;

        // If not unit is empty
        if(unit) {
          console.log('unit is not null', unit);
          for(j=0; j<invoices.length; j++) {
            console.log('invoices', invoices[j]);
            for(k=0; k<invoices[j].invoice_detail.length; k++) {
              console.log('invoiceDetail', invoices[j]);
              invoiceDetail = invoices[j].invoice_detail[k];

              // Get correct units
              temp = invoices[j].invoice_detail[k].all_units[unit];
              ratio = invoiceDetail.qty_retur / invoiceDetail.qty;

              // Get item
              invoices[j].invoice_detail[k].mod_qty = temp;
              invoices[j].invoice_detail[k].mod_unit = unit;
              invoices[j].invoice_detail[k].mod_qty_retur = ratio * temp;
            }
          }

          // Only do once, because the rest of invoice delivery units is same
          break;
        }
      }

      console.log('init pom', invoices, invoicesDelivery);

      return invoices;
    };

    this._getInvoiceItems = function() {
        var i, j;
        var list = [];
        var invoices = this.data.invoices;
        var invoiceDetails = this.data.invoices.invoice_detail;

        for(i in invoices) {
            invoiceDetails = invoices[i].invoice_detail;
            for(j in invoiceDetails) {
                list.push(invoiceDetails[j]);
            }
        }

        return list;
    };

    this._getInvoiceDeliveryItems = function() {
        var i, j;
        var list = [];
        var invoices = this.data.invoices_delivery;
        var invoiceDetails;

        for(i in invoices) {
            invoiceDetails = invoices[i].invoice_detail;
            for(j in invoiceDetails) {
                list.push(invoiceDetails[j]);
            }
        }

        return list;
    };

    this._getProfitableInvoiceItems = function() {
        var i, j;
        var orderDetails = this.data.details;
        var invoiceDetails;

        // For details
        var list = [];
        for(i in orderDetails) {
            invoiceDetails = this.data.details[i].nota_bahan;
            for(j in invoiceDetails) {
                list.push(invoiceDetails[j]);
            }
        }

        return list;
    };

    // Get available invoice item that could added to profitable table
    this.getAvailableInvoiceItem = function() {
        var i, j;
        var isFound = false;

        // Get all item in invoice
        var invoiceItems = this._getInvoiceItems();

        // Get all profitable item in invoice
        var profitableItems = this._getProfitableInvoiceItems();

        // Get ONLY invoice.item that not IN profitable item
        var list = [];
        for(i in invoiceItems) {
           isFound = false;
           for(j in profitableItems) {
               if(invoiceItems[i].item_id === profitableItems[j].item_id) {
                   isFound = true;
                   break;
               }
           }

           // When item is not in profitable table then add to list
           if(!isFound)
             list.push(invoiceItems[i]);
        }

        return list;
    };

    // Get available invoice item that could added to profitable table
    this.getAvailableInvoiceDeliveryItem = function() {
        // Get all item in invoice delivery

        // Get all profitable item in invoice delivery

        // Get ONLY invoice_delivery.item that not IN profitable item
    };
};