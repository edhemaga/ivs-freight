import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { BehaviorSubject, interval, Observable } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

const STORE_KEY = 'userLastAction';

@Injectable()
export class AppIdleService implements OnDestroy {
   public static runTimer: boolean;
   public USER_IDLE_TIMER_VALUE_IN_MIN = 2;
   public userIdlenessChecker: BehaviorSubject<string>;

   private sessionForIdle: Observable<number>;
   private userActivityChangeCallback: ($event) => void;

   constructor(private zone: NgZone) {
      if (!this.userIdlenessChecker) {
         this.userIdlenessChecker = new BehaviorSubject<string>(
            'INITIATE_TIMER'
         );
      }
   }

   get lastAction(): number {
      return parseInt(localStorage.getItem(STORE_KEY), 10);
   }

   set lastAction(value) {
      localStorage.setItem(STORE_KEY, value.toString());
   }

   public initilizeSessionTimeout(): void {
      if (!this.userIdlenessChecker) {
         this.userIdlenessChecker = new BehaviorSubject<string>(
            'INITIATE_TIMER'
         );
      }
      AppIdleService.runTimer = true;
      this.reset();
      this.initListener();
      this.initInterval();
   }

   handleUserActiveState(event): void {
      this.reset();
   }

   public reset(): void {
      this.lastAction = Date.now();
      if (this.userIdlenessChecker) {
         this.userIdlenessChecker.next('RESET_TIMER');
      }
   }

   stopIdleListen() {
      if (this.userIdlenessChecker) {
         this.userIdlenessChecker = undefined;
      }
      AppIdleService.runTimer = false;
   }

   ngOnDestroy(): void {
      this.stopIdleListen();
      this.userIdlenessChecker = undefined;
   }

   // If user is start witch clicking on page reset timer
   private initListener(): void {
      this.zone.runOutsideAngular(() => {
         this.userActivityChangeCallback = ($event) =>
            this.handleUserActiveState($event);
         window.document.addEventListener(
            'click',
            this.userActivityChangeCallback.bind(this),
            true
         );
         window.document.addEventListener(
            'mousedown',
            this.userActivityChangeCallback.bind(this),
            true
         );
      });
   }

   private initInterval(): void {
      const intervalDuration = 1000;
      this.sessionForIdle = interval(intervalDuration).pipe(
         map((tick: number) => {
            return tick;
         }),
         takeUntil(() => AppIdleService.runTimer)
      );

      this.check();
   }

   private check(): void {
      this.sessionForIdle.subscribe(() => {
         const now = Date.now();
         const timeleft =
            this.lastAction + this.USER_IDLE_TIMER_VALUE_IN_MIN * 60 * 1000;
         const diff = timeleft - now;
         const isTimeout = diff < 0;

         this.userIdlenessChecker.next(`${diff}`);

         if (isTimeout) {
            window.document.removeEventListener(
               'click',
               this.userActivityChangeCallback,
               true
            );
            this.zone.run(() => {
               if (this.userIdlenessChecker) {
                  this.userIdlenessChecker.next('STOPPED_TIMER');
               }
               AppIdleService.runTimer = false;
            });
         }
      });
   }
}
