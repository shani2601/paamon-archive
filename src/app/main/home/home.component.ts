import { Component } from "@angular/core";
import { Headline } from "../headline/headline.component";

@Component({
    standalone: true,
    selector: 'app-home',
    imports: [Headline],
    styleUrls: [],
    template: `
        <app-headline></app-headline>
    `
})
export class Home {

}