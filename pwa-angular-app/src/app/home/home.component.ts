import { Component, OnInit } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(config: NgbCarouselConfig) {  
    config.interval = 2000;  
    config.wrap = true;  
    config.keyboard = false;  
    config.pauseOnHover = false;  
  } 

  title = "Home Page";
  cards: any = [
    {
      title: 'Drawing Board',
      img: './assets/drawingBoard.jpeg',
      navigateUrl: '/drawingBoard'
    }
    //,
    // {
    //   title: 'Card Title 2',
    //   img: 'https://mdbootstrap.com/img/Photos/Horizontal/Nature/4-col/img%20(34).jpg'
    // },
    // {
    //   title: 'Card Title 3',
    //   img: 'https://mdbootstrap.com/img/Photos/Horizontal/Nature/4-col/img%20(34).jpg'
    // }
  ];

  ngOnInit(): void {
  }

}
