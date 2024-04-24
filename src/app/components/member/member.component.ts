import { Component, Input } from '@angular/core';
import { Member } from '../../models/family.model';
import { DropdownService } from '../../shared/services/dropdown.service';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrl: './member.component.scss'
})
export class MemberComponent {

  @Input() member: Member = new Member();

  constructor(public dropdownService:DropdownService) { }

  onDateChange(event: any) {
    this.member.dateOfBirth = event.value.toISOString().substring(0, 10);
  }
}
