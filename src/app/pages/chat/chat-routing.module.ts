import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

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
            users: UserResolver,
        },
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ChatRoutingModule { }