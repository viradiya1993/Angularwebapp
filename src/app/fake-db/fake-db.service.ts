import { InMemoryDbService } from 'angular-in-memory-web-api';


import { CalendarFakeDb } from 'app/fake-db/calendar';
import { QuickPanelFakeDb } from 'app/fake-db/quick-panel';


export class FakeDbService implements InMemoryDbService {
    createDb(): any {
        return {
            // Calendar
            'calendar': CalendarFakeDb.data,
            // Quick Panel
            'quick-panel-events': QuickPanelFakeDb.events
        };
    }
}
