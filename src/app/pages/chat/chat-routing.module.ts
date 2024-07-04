import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

//Components
import { ChatComponent } from "@pages/chat/components/chat/chat.component";

//Resolvers
import { UserResolver } from "@pages/chat/resolvers/user.resolver";
import { DriverResolver } from "@pages/chat/resolvers/driver.resolver";

//Services

const routes: Routes = [
    {
        path: '',
        component: ChatComponent,
        resolve: {
            users: UserResolver,
            drivers: DriverResolver
        },
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ChatRoutingModule { }