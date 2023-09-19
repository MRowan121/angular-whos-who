import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.css"],
})
export class SettingsComponent implements OnInit {
  @Input() name: string = "";
  @Input() amount: number = 0;
  @Input() min: number = 0;
  @Input() max: number = 4;

  @Output() incrementProductByName = new EventEmitter<string>();
  handleIncrement() {
    this.incrementProductByName.emit();
  }

  @Output() decrementProductByName = new EventEmitter<string>();
  handleDecrement() {
    this.decrementProductByName.emit();
  }

  constructor() {}

  ngOnInit(): void {}

  increment() {
    this.amount += 1;
  }

  decrement() {
    this.amount -= 1;
  }
}
