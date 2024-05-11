import { Component, Input } from '@angular/core';
import { Member } from '../../models/family.model';
import { DropdownService } from '../../shared/services/dropdown.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrl: './member.component.scss'
})
export class MemberComponent {

  @Input() member: Member = new Member();

  constructor(public dropdownService:DropdownService,private datePipe:DatePipe) { }

  onDateChange(event: any) {
    this.member.dateOfBirth = this.datePipe.transform(event.value, 'yyyy-MM-dd')!;
  }
}
