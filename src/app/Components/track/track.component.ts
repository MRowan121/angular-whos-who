import { Component, Input, Output, OnInit, EventEmitter } from "@angular/core";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { Track } from "src/app/home/home.component";

@Component({
  selector: "app-track",
  templateUrl: "./track.component.html",
  styleUrls: ["./track.component.css"],
})
export class TrackComponent implements OnInit {
  @Input() track!: Track;
  @Input() isActive: boolean = false;
  @Input() index!: number;
  @Output() trackClicked = new EventEmitter<void>();
  constructor() {}

  ngOnInit(): void {}

  faPlay = faPlay;

  onClick() {
    this.trackClicked.emit();
    console.log(this.track.trackPreview);
  }
}
