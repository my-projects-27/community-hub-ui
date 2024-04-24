import { Component, OnInit } from '@angular/core';
import { DropdownService } from './shared/services/dropdown.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  title = 'community-hub-ui';
  constructor(private dropdownService:DropdownService){
  }
  ngOnInit(): void {
  }
}
