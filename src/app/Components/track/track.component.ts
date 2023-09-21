import { Component, Input, Output, OnInit, EventEmitter } from "@angular/core";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { Track } from "src/app/home/home.component";
import { Howl } from 'howler';

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
  private isPlaying: boolean = false;


  constructor() {

   

  }

  ngOnInit(): void {

    this.sound = new Howl({
      src: [this.track.trackPreview], // Replace with your audio file path
      html5: true,
    volume: 0.5
    });

  }

  faPlay = faPlay;

  onClick() {
    this.trackClicked.emit();
    console.log(this.track.trackPreview)
    console.log(this.sound)
    if(this.sound?.playing()){
      this.sound.pause()
    }else{
      this.sound?.play()
    }
    

  }
}
