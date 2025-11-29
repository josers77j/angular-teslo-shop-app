import { Pipe, PipeTransform } from "@angular/core";
import { environment } from "../../../environments/environment.development";

const baseUrl = environment.baseUrl;

@Pipe({
  name: "productImage",
})
export class ProductImagePipe implements PipeTransform {
  transform(value: null | string | string[]): string {
    if (value === null) {
      return "./assets/images/no-image.jpg";
    }

    if (typeof value === "string" && value.startsWith("blob:")) {
      return value;
    }
    if (value.length === 0 || value[0].length === 0)
      return `./assets/images/no-image.jpg`;

    if (typeof value === "string") return `${baseUrl}/files/product/${value}`;

    return `${baseUrl}/files/product/${value[0]}`;
  }
}
