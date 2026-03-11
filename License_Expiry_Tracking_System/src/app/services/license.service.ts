import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface License {
    _id?: string;
    name: string;
    key: string;
    provider: string;
    expiryDate: Date | string;
    status?: string;
}

@Injectable({
    providedIn: 'root'
})
export class LicenseService {
    private apiUrl = `${environment.apiUrl}/licenses`;

    constructor(private http: HttpClient) { }

    getLicenses(filters?: any): Observable<License[]> {
        let params = new HttpParams();
        if (filters) {
            Object.keys(filters).forEach(key => {
                if (filters[key]) {
                    params = params.set(key, filters[key]);
                }
            });
        }
        return this.http.get<License[]>(this.apiUrl, { params });
    }

    getLicense(id: string): Observable<License> {
        return this.http.get<License>(`${this.apiUrl}/${id}`);
    }

    createLicense(license: License): Observable<License> {
        return this.http.post<License>(this.apiUrl, license);
    }

    updateLicense(id: string, license: Partial<License>): Observable<License> {
        return this.http.put<License>(`${this.apiUrl}/${id}`, license);
    }

    renewLicense(id: string, extensionDays: number): Observable<License> {
        return this.http.post<License>(`${this.apiUrl}/${id}/renew`, { days: extensionDays });
    }

    deleteLicense(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    getStats(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/stats`);
    }
}
