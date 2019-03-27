import { InMemoryDbService } from 'angular-in-memory-web-api';


import { MattersFakeDb } from 'app/fake-db/matters';
import { CalendarFakeDb } from 'app/fake-db/calendar';


export class FakeDbService implements InMemoryDbService {
    createDb(): any {
        return {
            // Contacts
            'matters-matters': MattersFakeDb.matters,
            'matters-user': MattersFakeDb.user,
            // Calendar
            'calendar': CalendarFakeDb.data,
        };
    }
}
