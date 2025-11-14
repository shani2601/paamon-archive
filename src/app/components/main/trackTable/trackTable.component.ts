import { Component } from "@angular/core";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Tracks } from "../../../data/tracks.data";
import { DatePipe } from "@angular/common";

export interface TimeOption {
    readonly label: string,
    readonly minutes: number
}

@Component ({
    standalone: true,
    selector: 'track-table',
    imports: [MatFormFieldModule, MatSelectModule, DatePipe],
    templateUrl: './trackTable.component.html',
    styleUrl: './trackTable.component.css'
})
export class TrackTableComponent {
    readonly filteringTimes: ReadonlyArray <TimeOption> = [
        {label: "5 דקות", minutes: 5}, 
        {label: "10 דקות", minutes: 10},
        {label: "30 דקות", minutes: 30},
        {label: "1 שעות", minutes: 60},
        {label: "3 שעות", minutes: 180}
    ];

    readonly tracks = Tracks;
}