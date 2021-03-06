import { Observable } from 'rxjs';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  ROUTE_ANIMATIONS_ELEMENTS,
  ROUTE_ANIMATIONS_PAGE,
  NotificationService,
  LocalStorageService
} from '@app/core';
import { Feature, features } from './features.data';
import { MtalkHttpService } from '@app/core/mtalk-http/mtalk-http.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogSearchComponent } from './search-dialog/dialog-user.component';
import { ActivatedRoute, Router } from '@angular/router';

export interface DialogData {
  searchData: string;
}

@Component({
  selector: 'anms-features',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.scss']
})
export class ExploreComponent implements OnInit {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  routeAnimationsPage = ROUTE_ANIMATIONS_PAGE;
  features: Feature[] = features;
  searchData: string;
  headline: string;
  tag: string;
  public posts: any[];
  constructor(
    private mtalkHttpService: MtalkHttpService,
    private notificationService: NotificationService,
    public dialog: MatDialog,
    private routeInfo: ActivatedRoute,
  ) { }

  ngAfterViewInit() { }
  ngOnInit() {
    this.tag = this.routeInfo.snapshot.queryParams['tag'];
    if (this.tag) {
      this.getTagPost()
    } else {
      this.getPosts();
    }
  }
  getTagPost() {
    this.mtalkHttpService.tagPost({ tag: this.tag }).subscribe(value => {
      console.log(value)
      this.posts = value.data;
      this.headline = `#${this.tag}#`;
    })
  }
  getPosts() {
    this.mtalkHttpService.getPosts().subscribe(value => {
      this.posts = value;
    });
  }

  openDialog(): void {
    let dialogRef = this.dialog.open(DialogSearchComponent, {
      height: '230px',
      width: '600px',
      data: { title: '搜索' }
    });
    dialogRef.afterClosed().subscribe(next => {
      this.mtalkHttpService
        .searchPost({ search: next.username })
        .subscribe(value => {
          console.log(value.data);
          if (value.success) {
            this.headline = next.username;
            this.posts = value.data;
          } else {
            this.notificationService.error('搜索失败!');
          }
        });
    });
  }

  openLink(link: string) {
    window.open(link, '_blank');
  }
  /* 搜索 */
  search() {
    this.openDialog();
  }
}
