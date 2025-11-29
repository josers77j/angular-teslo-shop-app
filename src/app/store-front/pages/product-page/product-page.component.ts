import { Component, inject } from "@angular/core";
import { rxResource } from "@angular/core/rxjs-interop";
import { ActivatedRoute } from "@angular/router";
import { ProductCarrousel } from "@products/components/product-carrousel/product-carrousel";
import { ProductsService } from "@products/services/products.service.ts.service";

@Component({
  selector: "app-product-page",
  imports: [ProductCarrousel],
  templateUrl: "./product-page.component.html",
})
export class ProductPageComponent {
  productService = inject(ProductsService);
  activatedRoute = inject(ActivatedRoute);

  productIdSlug: string = this.activatedRoute.snapshot.params["idSlug"];

  productResource = rxResource({
    request: () => ({ idSlug: this.productIdSlug }),
    loader: ({ request }) => {
      return this.productService.getProductByIdSlug(request.idSlug);
    },
  });
}
