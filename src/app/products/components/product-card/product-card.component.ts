import { SlicePipe } from "@angular/common";
import { Component, inject, input } from "@angular/core";

import { RouterLink } from "@angular/router";
import { Product } from "@products/interfaces/product.interface";
import { ProductImagePipe } from "@products/pipes/product-image.pipe";
import { ProductsService } from "@products/services/products.service.ts.service";

@Component({
  selector: "product-card",
  imports: [RouterLink, SlicePipe, ProductImagePipe],
  templateUrl: "./product-card.component.html",
})
export class ProductCardComponent {
  productItem = input.required<Product>();
  productService = inject(ProductsService);
}
