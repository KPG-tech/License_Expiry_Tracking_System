import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = environment.apiUrl;
    private currentUserSubject = new BehaviorSubject<any>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    constructor(private http: HttpClient) {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            this.currentUserSubject.next(JSON.parse(storedUser));
        }
    }

    signup(credentials: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/auth/signup`, credentials);
    }

    login(credentials: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/auth/login`, credentials).pipe(
            tap(response => {
                if (response && response.token) {
                    localStorage.setItem('currentUser', JSON.stringify(response.user));
                    localStorage.setItem('token', response.token);
                    this.currentUserSubject.next(response.user);
                }
            })
        );
    }

    logout(): void {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');
        this.currentUserSubject.next(null);
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    isAuthenticated(): boolean {
        return !!this.getToken();
    }
}    
