import { Component, inject, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "@auth/services/auth.service";

@Component({
  selector: "app-register-page-component",
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: "./register-page.component.html",
})
export class RegisterPageComponent {
  authService = inject(AuthService);
  fb = inject(FormBuilder);
  hasErrors = signal(false);
  isPosting = signal(false);

  router = inject(Router);

  registerForm = this.fb.group({
    email: ["", [Validators.required, Validators.email]],
    fullName: ["", [Validators.required]],
    password: ["", [Validators.required, Validators.min(6)]],
  });

  onSubmit() {
    if (this.registerForm.invalid) {
      this.hasErrors.set(true);
      setTimeout(() => {
        this.hasErrors.set(false);
      }, 2000);
    }

    const {
      email = "",
      fullName = "",
      password = "",
    } = this.registerForm.value;

    this.authService
      .register(email!, fullName!, password!)
      .subscribe((isAuthenticated) => {
        if (isAuthenticated) {
          this.router.navigateByUrl("/auth/login");
        }
        this.hasErrors.set(true);
      });

    return this.registerForm.value;
  }
}
