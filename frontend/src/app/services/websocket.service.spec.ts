import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { WebSocketService } from './websocket.service';
import { WebSocketSubject } from 'rxjs/webSocket';
import { Observer, Subscription } from 'rxjs';

interface WebSocketObserver extends Observer<any> {
  next: (value: any) => void;
  error: (error: any) => void;
  complete: () => void;
}

describe('WebSocketService', () => {
  let service: WebSocketService;
  let mockWebSocketSubject: jasmine.SpyObj<WebSocketSubject<any>>;
  let mockSubscription: Subscription;
  let webSocketConfig: any;
  let webSocketObserver: WebSocketObserver;

  beforeEach(() => {
    mockSubscription = new Subscription();
    mockWebSocketSubject = jasmine.createSpyObj('WebSocketSubject', ['subscribe', 'complete', 'pipe']);
    mockWebSocketSubject.closed = false;
    mockWebSocketSubject.pipe.and.returnValue(mockWebSocketSubject);

    webSocketObserver = {
      next: jasmine.createSpy('next'),
      error: jasmine.createSpy('error'),
      complete: jasmine.createSpy('complete')
    };

    mockWebSocketSubject.subscribe.and.callFake((observerOrNext?: any) => {
      if (typeof observerOrNext === 'function') {
        webSocketObserver.next = observerOrNext;
      } else if (observerOrNext && typeof observerOrNext === 'object') {
        if (observerOrNext.next) webSocketObserver.next = observerOrNext.next;
        if (observerOrNext.error) webSocketObserver.error = observerOrNext.error;
        if (observerOrNext.complete) webSocketObserver.complete = observerOrNext.complete;
      }
      return mockSubscription;
    });

    const createSpy = spyOn(WebSocketSubject, 'create').and.callFake((config: any) => {
      webSocketConfig = config;
      // Simulate initial connection
      if (config.openObserver) {
        setTimeout(() => config.openObserver.next(), 0);
      }
      return mockWebSocketSubject;
    });

    TestBed.configureTestingModule({
      providers: [WebSocketService]
    });

    service = TestBed.inject(WebSocketService);
    createSpy.calls.reset();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with disconnected state', fakeAsync(() => {
    let connectionStatus: boolean | undefined;
    service.getConnectionStatus().subscribe(status => {
      connectionStatus = status;
    });
    tick();
    expect(connectionStatus).toBeFalse();
  }));

  it('should update connection status when WebSocket connects', fakeAsync(() => {
    let connectionStatus: boolean | undefined;
    service.getConnectionStatus().subscribe(status => {
      connectionStatus = status;
    });

    webSocketConfig.openObserver.next();
    tick();

    expect(connectionStatus).toBeTrue();
  }));

  it('should update connection status when WebSocket disconnects', fakeAsync(() => {
    let connectionStatus: boolean | undefined;
    service.getConnectionStatus().subscribe(status => {
      connectionStatus = status;
    });

    webSocketConfig.openObserver.next();
    tick();

    webSocketConfig.closeObserver.next();
    tick();

    expect(connectionStatus).toBeFalse();
  }));

  it('should attempt to reconnect when connection is lost', fakeAsync(() => {
    // Reset the spy count
    (WebSocketSubject.create as jasmine.Spy).calls.reset();

    // Simulate connection loss
    webSocketConfig.closeObserver.next();
    tick();

    // Fast-forward time to trigger reconnection attempt
    tick(3000);

    // Verify reconnection attempt
    expect(WebSocketSubject.create).toHaveBeenCalled();
  }));

  it('should handle WebSocket errors', fakeAsync(() => {
    let connectionStatus: boolean | undefined;
    service.getConnectionStatus().subscribe(status => {
      connectionStatus = status;
    });

    webSocketObserver.error(new Error('WebSocket error'));
    tick();

    expect(connectionStatus).toBeFalse();
  }));

  it('should handle WebSocket messages', fakeAsync(() => {
    const testMessage = { type: 'test', data: 'message' };
    mockWebSocketSubject.subscribe.calls.reset();

    webSocketObserver.next(testMessage);
    tick();

    expect(mockWebSocketSubject.subscribe).toHaveBeenCalled();
  }));

  it('should clean up resources on disconnect', fakeAsync(() => {
    service.disconnect();
    tick();

    expect(mockWebSocketSubject.complete).toHaveBeenCalled();
  }));

  afterEach(() => {
    service.disconnect();
  });
});
