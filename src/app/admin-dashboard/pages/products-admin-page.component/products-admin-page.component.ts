import { Component, inject, signal } from "@angular/core";
import { rxResource } from "@angular/core/rxjs-interop";
import { ProductTable } from "@products/components/product-table/product-table.component";
import { ProductsService } from "@products/services/products.service.ts.service";
import { PaginationComponent } from "@shared/components/pagination/pagination.component";
import { PaginationService } from "@shared/components/pagination/pagination.service";
import { RouterLink } from "@angular/router";

@Component({
  selector: "products-admin-page-component",
  imports: [ProductTable, PaginationComponent, RouterLink],
  templateUrl: "./products-admin-page.component.html",
})
export class ProductsAdminPageComponent {
  productService = inject(ProductsService);

  paginationService = inject(PaginationService);
  productsPerPage = signal(10);

  productsResource = rxResource({
    request: () => ({
      page: this.paginationService.currentPage() - 1,
      limit: this.productsPerPage(),
    }),
    loader: ({ request }) => {
      return this.productService.getProducts({
        offset: request.page * 9,
        limit: request.limit,
      });
    },
  });
}
