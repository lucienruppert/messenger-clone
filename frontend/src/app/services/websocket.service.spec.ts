import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { WebSocketService } from './websocket.service';
import { WebSocketSubject } from 'rxjs/webSocket';
import { take } from 'rxjs/operators';

describe('WebSocketService', () => {
  let service: WebSocketService;
  let mockWebSocket: jasmine.SpyObj<WebSocketSubject<any>>;
  
  beforeEach(() => {
    // Create mock WebSocket
    mockWebSocket = jasmine.createSpyObj('WebSocketSubject', ['next', 'complete', 'subscribe']);
    mockWebSocket.closed = false;
    
    // Mock sessionStorage
    const mockSessionStorage = {
      getItem: jasmine.createSpy('getItem'),
      setItem: jasmine.createSpy('setItem'),
      removeItem: jasmine.createSpy('removeItem')
    };
    (window as any).sessionStorage = mockSessionStorage;
    
    TestBed.configureTestingModule({
      providers: [WebSocketService]
    });
    
    service = TestBed.inject(WebSocketService);
    // @ts-ignore - accessing private property for testing
    service['webSocket$'] = mockWebSocket;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Connection Management', () => {
    it('should initialize connection if user is logged in', () => {
      spyOn(sessionStorage, 'getItem').and.returnValues('true', 'test@email.com', 'Test User');
      service = TestBed.inject(WebSocketService);
      
      // @ts-ignore - accessing private property for testing
      expect(service.isConnectedSubject.value).toBeFalse();
      
      // Allow connection setup time
      tick(1000);
      
      expect(mockWebSocket.next).toHaveBeenCalledWith({
        type: 'login',
        senderEmail: 'test@email.com',
        name: 'Test User'
      });
    });

    it('should not auto-connect if user is not logged in', () => {
      spyOn(sessionStorage, 'getItem').and.returnValue('false');
      service = TestBed.inject(WebSocketService);
      
      // @ts-ignore - accessing private property for testing
      expect(service.isConnectedSubject.value).toBeFalse();
      expect(mockWebSocket.next).not.toHaveBeenCalled();
    });

    it('should handle connection errors and attempt reconnection', fakeAsync(() => {
      spyOn(service as any, 'reconnect');
      const errorSubscription = mockWebSocket.subscribe.and.callFake(({error}: any) => {
        error(new Error('Test connection error'));
      });

      service.connect();
      tick();

      expect(service['reconnect']).toHaveBeenCalled();
      errorSubscription.unsubscribe();
    }));
  });

  describe('Message Handling', () => {
    it('should send messages when connected', () => {
      const testMessage = { type: 'test', senderEmail: 'test@email.com', name: 'Test' };
      service.sendMessage(testMessage);
      expect(mockWebSocket.next).toHaveBeenCalledWith(testMessage);
    });

    it('should handle login response messages', fakeAsync(() => {
      const loginResponse = { type: 'loginResponse', success: true };
      mockWebSocket.subscribe.and.callFake(({next}: any) => {
        next(loginResponse);
      });

      service.connect();
      tick();

      // @ts-ignore - accessing private property for testing
      expect(service.isConnectedSubject.value).toBeTrue();
    }));

    it('should update partners list on users message', fakeAsync(() => {
      const users = [
        { email: 'user1@test.com', name: 'User 1' },
        { email: 'user2@test.com', name: 'User 2' }
      ];
      mockWebSocket.subscribe.and.callFake(({next}: any) => {
        next({ type: 'users', users });
      });

      let receivedPartners: any[] = [];
      service.getPartners().pipe(take(1)).subscribe(partners => {
        receivedPartners = partners;
      });

      service.connect();
      tick();

      expect(receivedPartners).toEqual(users);
    }));

    it('should queue messages when disconnected and retry after reconnection', fakeAsync(() => {
      // @ts-ignore - accessing private property for testing
      service.webSocket$.closed = true;
      const testMessage = { type: 'test', senderEmail: 'test@email.com', name: 'Test' };
      
      service.sendMessage(testMessage);
      tick(1000);

      // @ts-ignore - accessing private property for testing
      service.webSocket$.closed = false;
      expect(mockWebSocket.next).toHaveBeenCalledWith(testMessage);
    }));
  });

  describe('Disconnection', () => {
    it('should handle intentional disconnection', () => {
      service.disconnect();
      
      // @ts-ignore - accessing private property for testing
      expect(service.intentionalDisconnect).toBeTrue();
      // @ts-ignore - accessing private property for testing
      expect(service.isConnectedSubject.value).toBeFalse();
      expect(mockWebSocket.complete).toHaveBeenCalled();
    });

    it('should not attempt reconnection after intentional disconnect', fakeAsync(() => {
      spyOn(service as any, 'reconnect');
      service.disconnect();
      tick(3000);

      expect(service['reconnect']).not.toHaveBeenCalled();
    }));
  });

  describe('Reconnection', () => {
    it('should attempt reconnection at intervals', fakeAsync(() => {
      spyOn(service, 'connect');
      // @ts-ignore - accessing private property for testing
      service.reconnect();
      
      tick(3000);
      expect(service.connect).toHaveBeenCalledTimes(2);
      
      tick(3000);
      expect(service.connect).toHaveBeenCalledTimes(3);
    }));

    it('should stop reconnection attempts when connected', fakeAsync(() => {
      spyOn(service, 'connect');
      // @ts-ignore - accessing private property for testing
      service.reconnect();
      
      // Simulate successful connection
      // @ts-ignore - accessing private property for testing
      service.isConnectedSubject.next(true);
      
      tick(3000);
      expect(service.connect).toHaveBeenCalledTimes(1);
    }));
  });
});
