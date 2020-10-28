import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { FormControl } from "@angular/forms";
import { debounceTime, distinctUntilChanged, filter, map, switchMap, tap } from 'rxjs/operators';
import { Flight } from '@flight-workspace/flight-lib';

@Component({
    selector: 'flight-lookahead',
    templateUrl: './flight-lookahead.component.html'
})

export class FlightLookaheadComponent implements OnInit {

    constructor(private http: HttpClient) {
    }

    control: FormControl;
    flights$: Observable<Flight[]>;
    loading = false;










    ngOnInit() {
        this.control = new FormControl();

        this.flights$ = this
                            .control
                            .valueChanges
                            .pipe(
                              filter(v => v.length >= 3),
                              debounceTime(300),
                              distinctUntilChanged(),
                              tap(v => this.loading = true),
                              switchMap(name => this.load(name)),
                              // map(all => all.filter(f => f.from.startsWith(this.control.value))),
                              tap(v => this.loading = false)
                            );
    }

    load(from: string)  {
        const url = "http://www.angular.at/api/flight";

        //const url = '/assets/data/data.json';

        const params = new HttpParams()
                            .set('from', from);

        const headers = new HttpHeaders()
                            .set('Accept', 'application/json');

        return this.http.get<Flight[]>(url, {params, headers});

    };


}
