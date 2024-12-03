import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidebarComponent } from './sidebar.component';
import { AuthenticationService } from '../../../services/authentication.service';
import { WebSocketService } from '../../../services/websocket.service';
import { BehaviorSubject } from 'rxjs';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  let mockAuthService: jasmine.SpyObj<AuthenticationService>;
  let mockWebSocketService: jasmine.SpyObj<WebSocketService>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthenticationService', ['logout']);
    mockWebSocketService = jasmine.createSpyObj('WebSocketService', ['getConnectionStatus', 'disconnect']);
    mockWebSocketService.getConnectionStatus.and.returnValue(new BehaviorSubject(false));

    await TestBed.configureTestingModule({
      imports: [SidebarComponent],
      providers: [
        { provide: AuthenticationService, useValue: mockAuthService },
        { provide: WebSocketService, useValue: mockWebSocketService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call logout when logout method is called', () => {
    component.logout();
    expect(mockAuthService.logout).toHaveBeenCalled();
  });

  it('should call disconnect on WebSocketService when destroyed', () => {
    fixture.destroy();
    expect(mockWebSocketService.disconnect).toHaveBeenCalled();
  });
});
