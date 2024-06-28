import { Routes } from "@angular/router";

//Components
import { ChatComponent } from "./components/chat/chat.component";

//Resolvers
import { UserResolver } from "./resolvers/user.resolver";

//Services
import { ChatService } from "./services/chat.service";

const routes: Routes = [
    {
        path: '',
        component: ChatComponent,
        resolve: {
            users: null,
            drivers: null
        },
        providers: [
            //Resolvers
            UserResolver,

            //Services
            ChatService
        ]
    }
];