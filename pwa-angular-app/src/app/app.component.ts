import { Component, ElementRef, ViewChild } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [NgbModalConfig, NgbModal]
})
export class AppComponent {
  title = 'pwa-angular-app - Omer play ground';
  
  @ViewChild('content') updateModalElement: ElementRef;

  constructor(config: NgbModalConfig, private modalService: NgbModal, update: SwUpdate) {
    // customize default values of modals used by this component tree
    config.backdrop = 'static';
    config.keyboard = false;
    //this.modalService.open(this.updateModalElement);
    
    update.available.subscribe(e => {
      console.log('***** update app available - open modal! *****');

      update.activateUpdate().then(()=> {
        this.updateVersion();
        //this.modalService.open(this.updateModalElement);
      });
    });

  }

  public updateVersion() {
    console.log('***** reaload new update *****');
    document.location.reload();
  }

}
