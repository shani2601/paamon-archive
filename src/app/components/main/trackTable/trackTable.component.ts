import { Component } from "@angular/core";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Tracks } from "../../../data/tracks.data";
import { DatePipe } from "@angular/common";
import { FormsModule } from '@angular/forms';
import { Track } from "../../../models/track.model";

export interface TimeOption {
    readonly label: string,
    readonly miliseconds: number
}

@Component ({
    standalone: true,
    selector: 'track-table',
    imports: [MatFormFieldModule, MatSelectModule, DatePipe, FormsModule],
    templateUrl: './trackTable.component.html',
    styleUrl: './trackTable.component.css'
})
export class TrackTableComponent {
    readonly filteringTimes: ReadonlyArray <TimeOption> = [
        {label: "5 דקות", miliseconds: 5 * 60 * 1000}, 
        {label: "10 דקות", miliseconds: 10 * 60 * 1000},
        {label: "30 דקות", miliseconds: 30 * 60 * 1000},
        {label: "1 שעות", miliseconds: 60 * 60 * 1000},
        {label: "3 שעות", miliseconds: 180 * 60 * 1000}
    ];

    selectedTime!: number;
    
    getTracksBySelctedTime(selectedTime: number): Track[] {
        if (selectedTime) {
            const timeInMiliseconds = ((this.filteringTimes).find(time => (time.miliseconds === selectedTime)))?.miliseconds;

            if (timeInMiliseconds) {
                const now = Date.now();
                return (Tracks.filter(track => (track.launchTime >= (now - timeInMiliseconds))));
            }
        }
        
        return [];
    }
}