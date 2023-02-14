import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ShareDialogComponent } from '../share-dialog/share-dialog.component';

@Component({
  selector: 'app-share-button',
  templateUrl: './share-button.component.html',
  styleUrls: ['./share-button.component.css']
})
export class ShareButtonComponent {
  constructor(public dialog: MatDialog) { }

  openShareDialog() {
    this.dialog.open(ShareDialogComponent, {});
  }
}
