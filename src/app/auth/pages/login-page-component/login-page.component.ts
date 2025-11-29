import { Component, inject, signal } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { AuthService } from "@auth/services/auth.service";

@Component({
  selector: "app-login-page",
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: "./login-page.component.html",
})
export class LoginPageComponent {
  fb = inject(FormBuilder);
  hasErrors = signal(false);
  isPosting = signal(false);

  router = inject(Router);

  loginForm = this.fb.group({
    email: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required, Validators.min(6)]],
  });

  authService = inject(AuthService);

  onSubmit() {
    if (this.loginForm.invalid) {
      this.hasErrors.set(true);
      setTimeout(() => {
        this.hasErrors.set(false);
      }, 2000);
    }
    const { email = "", password = "" } = this.loginForm.value;
    this.authService.login(email!, password!).subscribe((isAuthenticated) => {
      if (isAuthenticated) {
        this.router.navigateByUrl("/");
      }
      this.hasErrors.set(true);
    });

    return this.loginForm.value;
  }
}
