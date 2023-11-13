import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-content',
  templateUrl: './modal.component.html',
})
export class ModalContentComponent implements OnInit {
  @Input() public items : any;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  public newquantity  = 0
  constructor(
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
  
  }

  ok() {

    this.passEntry.emit(true);
    this.activeModal.close();
  }
}