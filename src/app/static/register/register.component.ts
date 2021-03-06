import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { filter, debounceTime, take } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import {
  ROUTE_ANIMATIONS_ELEMENTS,
  NotificationService,
  ROUTE_ANIMATIONS_PAGE
} from '@app/core';
// import { State } from '../../examples.state';
import { ActionFormUpdate, ActionFormReset } from '../form.actions';
import { selectFormState } from '../form.selectors';
import { Form } from './form.model';
import { MtalkHttpService } from '@app/core/mtalk-http/mtalk-http.service';

@Component({
  selector: 'anms-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  code = `/api/checkCode`;
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  routeAnimationsPage = ROUTE_ANIMATIONS_PAGE;

  /* tag控制 */
  myTags = [];
  tagState = false;
  isreg = false;
  tagOption = {
    dragControl: false,
    weight: true,
    activeCursor: 'activeCursor',
    initial: [-0.008, 0.008],
    shadow: '#000000',
    shuffleTags: true,
    wheelZoom: false,
    outlineMethod: 'none',
    zoom: 1.5,
    noMouse: true
  };

  form = this.fb.group({
    username: ['', [Validators.required]],
    nickname: ['', [Validators.required]],
    password: ['', [Validators.required]],
    repassword: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    checkCode: ['', [Validators.required]]
  });

  formValueChanges$: Observable<Form>;

  constructor(
    private fb: FormBuilder,
    // private store: Store<State>,
    private translate: TranslateService,
    private notificationService: NotificationService,
    private mtalkHttpService: MtalkHttpService,
    private router: Router
  ) { }

  ngOnInit() {
    this.mtalkHttpService.getSite().subscribe(value => {
      this.myTags = JSON.parse(value.data[0].talks)
      this.isreg = value.data[0].isreg
      console.log(this.myTags)
      setInterval(time => {
        this.tagState = true
      }, 0)
    })
  }

  submit() {
    /* 判断是否允许注册 */
    if (this.isreg) {
      this.notificationService.error('本站点禁止注册！')
      return false
    }

    if (this.form.valid) {
      // this.save();
      this.mtalkHttpService.register(this.form.value).subscribe(
        value => {
          if (value.success === true) {
            this.notificationService.success('注册成功,请登录');
            this.refCode();
            this.router.navigateByUrl(`/login`);
          } else {
            this.notificationService.error(value.msg);
            this.refCode();
          }
        },
        error => {
          this.notificationService.error('注册失败,请检查网络连接');
        }
      );
    }
  }

  reset() {
    this.form.reset();
    this.form.clearValidators();
    this.form.clearAsyncValidators();
    // this.store.dispatch(new ActionFormReset());
  }

  /* 刷新验证码 */
  refCode() {
    this.code = `/api/checkCode?` + Math.random();
  }
}
