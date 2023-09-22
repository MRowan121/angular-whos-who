import { Component, Input, Output, OnInit, EventEmitter } from "@angular/core";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { Track } from "src/app/home/home.component";
import { Howl, Howler } from "howler";

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

  private sound: Howl | undefined = undefined;
  faPlay = faPlay;

  constructor() {}

  ngOnInit(): void {
    this.sound = new Howl({
      src: [this.track.trackPreview],
      html5: true,
      volume: 0.5,
    });
  }

  onClick() {
    this.trackClicked.emit();
    if (this.sound?.playing()) {
      this.sound.stop();
    } else {
      Howler.stop();
      this.sound?.play();
    }
  }
}
