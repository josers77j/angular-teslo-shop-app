import {
  Component,
  computed,
  inject,
  input,
  OnInit,
  signal,
} from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { ProductCarrousel } from "@products/components/product-carrousel/product-carrousel";
import { Product } from "@products/interfaces/product.interface";
import { FormUtils } from "../../../../utils/form-utils";
import { FormErrorLabel } from "@shared/components/form-error-label/form-error-label.component";
import { ProductsService } from "@products/services/products.service.ts.service";
import { Router } from "@angular/router";
import { firstValueFrom } from "rxjs";

@Component({
  selector: "product-details",
  imports: [ProductCarrousel, ReactiveFormsModule, FormErrorLabel],
  templateUrl: "./product-details.component.html",
})
export class ProductDetailsComponent implements OnInit {
  product = input.required<Product>();

  productService = inject(ProductsService);
  router = inject(Router);

  fb = inject(FormBuilder);
  wasSaved = signal(false);
  tempImages = signal<string[]>([]);
  imageFileList: FileList | undefined = undefined;

  carouselImages = computed(() => {
    const currentProductImages = [
      ...this.product().images,
      ...this.tempImages(),
    ];
    return currentProductImages;
  });

  productForm = this.fb.group({
    title: ["", Validators.required],
    description: ["", Validators.required],
    slug: [
      "",
      [Validators.required, Validators.pattern(FormUtils.slugPattern)],
    ],
    price: [0, [Validators.required, Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    sizes: [[""]],
    images: [[""]],
    tags: [""],
    gender: [
      "men",
      [Validators.required, Validators.pattern(/men|women|kid|unisex/)],
    ],
  });

  ngOnInit(): void {
    this.setFormValue(this.product());
  }

  setFormValue(formLike: Partial<Product>) {
    this.productForm.reset(this.product() as any);
    // this.productForm.patchValue(formLike as any);
    this.productForm.patchValue({ tags: formLike.tags?.join("") });
  }

  sizes = ["XS", "S", "M", "L", "XL", "XXL"];

  onSizeClick(size: string) {
    const currentSize = this.productForm.value?.sizes ?? [];

    if (currentSize.includes(size)) {
      currentSize.splice(currentSize.indexOf(size), 1);
    } else {
      currentSize.push(size);
    }

    this.productForm.patchValue({ sizes: currentSize });
  }

  async onSubmit() {
    const isValid = this.productForm.valid;
    this.productForm.markAllAsTouched();
    if (!isValid) return;
    const formValue = this.productForm.value;
    const productLike: Partial<Product> = {
      ...(formValue as any),
      tags:
        formValue.tags
          ?.toLowerCase()
          .split(", ")
          .map((tag) => tag.trim()) ?? [],
    };

    if (this.product().id === "new") {
      const product = await firstValueFrom(
        this.productService.createProduct(productLike, this.imageFileList)
      );
      this.router.navigate(["/admin/products", product.id]);

      // this.productService.createProduct(productLike).subscribe((product) => {
      //   console.log("producto creado", product);
      //   this.router.navigate(["/admin/products", product.id]);

      //   this.wasSaved.set(true);
      // });
    } else {
      await firstValueFrom(
        this.productService.updateProduct(
          this.product().id,
          productLike,
          this.imageFileList
        )
      );
    }

    this.wasSaved.set(true);

    setTimeout(() => {
      this.wasSaved.set(false);
    }, 3000);
  }

  onFilesChanged(event: Event) {
    const fileList = (event.target as HTMLInputElement).files;
    this.imageFileList = fileList ?? undefined;

    const imageUrl = Array.from(fileList ?? []).map((file) =>
      URL.createObjectURL(file)
    );

    this.tempImages.set(imageUrl);
  }
}
