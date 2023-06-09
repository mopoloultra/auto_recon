import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'vendorCompanyFilter'
})
export class VendorCompanyFilterPipe implements PipeTransform {

  transform(items: any[]): any {

    if (!items) {
      return items;
    }
    return items.filter(item => !item.isVendor);
  }

}
