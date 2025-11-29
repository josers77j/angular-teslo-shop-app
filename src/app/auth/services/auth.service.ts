import { HttpClient } from "@angular/common/http";
import { computed, inject, Injectable, signal } from "@angular/core";
import { User } from "@auth/interfaces/user.interface";
import { environment } from "../../../environments/environment.development";
import { AuthResponse } from "@auth/interfaces/auth-response.interface";
import { catchError, map, Observable, of, tap } from "rxjs";
import { rxResource } from "@angular/core/rxjs-interop";

type AuthStatus = "checking" | "authenticated" | "not-authenticated";
const baseUrl = environment.baseUrl;
const AUTH_STATUS = {
  CHECKING: "checking",
  AUTHENTICATED: "authenticated",
  NOT_AUTHENTICATED: "not-authenticated",
} as const;

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private readonly _authStatus = signal<AuthStatus>("checking");
  private readonly _user = signal<User | null>(null);
  private readonly _token = signal<string | null>(
    localStorage.getItem("token")
  );

  private readonly http = inject(HttpClient);

  checkStatusResource = rxResource({
    loader: () => this.checkStatus(),
  });

  authStatus = computed<AuthStatus>(() => {
    if (this._authStatus() === AUTH_STATUS.CHECKING) {
      return AUTH_STATUS.CHECKING;
    }

    if (this._user()) {
      return AUTH_STATUS.AUTHENTICATED;
    }
    return AUTH_STATUS.NOT_AUTHENTICATED;
  });

  user = computed<User | null>(() => this._user());
  token = computed(this._token);
  isAdmin = computed(() => this._user()?.roles.includes("admin") ?? false);
  login(email: string, password: string): Observable<boolean> {
    return this.http
      .post<AuthResponse>(`${baseUrl}/auth/login`, {
        email,
        password,
      })
      .pipe(
        map((resp) => this.handleAuthSuccess(resp)),
        catchError((error: any) => this.handleAuthError(error))
      );
  }

  register(
    email: string,
    fullName: string,
    password: string
  ): Observable<boolean> {
    return this.http
      .post<AuthResponse>(`${baseUrl}/auth/register`, {
        email,
        password,
        fullName,
      })
      .pipe(
        map((resp) => this.handleAuthSuccess(resp)),
        catchError((error: any) => this.handleAuthError(error))
      );
  }

  checkStatus(): Observable<boolean> {
    const token = localStorage.getItem("token");
    if (!token) {
      this.logout();
      return of(false);
    }

    return this.http
      .get<AuthResponse>(`${baseUrl}/auth/check-status`, {
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // },
      })
      .pipe(
        tap((resp) => this.handleAuthSuccess(resp)),
        map(() => true),
        catchError((error: any) => this.handleAuthError(error))
      );
  }

  logout() {
    this._user.set(null);
    this._token.set(null);
    this._authStatus.set(AUTH_STATUS.NOT_AUTHENTICATED);

    localStorage.removeItem("token");
  }

  private handleAuthSuccess(resp: AuthResponse) {
    this._user.set(resp.user);
    this._token.set(resp.token);
    this._authStatus.set(AUTH_STATUS.AUTHENTICATED);

    localStorage.setItem("token", resp.token);

    return true;
  }

  private handleAuthError(error: any): Observable<boolean> {
    this.logout();
    return of(false);
  }
}
