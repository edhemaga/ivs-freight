import { Observable, of } from "rxjs";
import { CompanyUserChat } from "../models/company-user-chat.model";

export class ChatService {
    constructor() { }

    getCompanyUserList(): Observable<CompanyUserChat[]> {
        //TODO remove mock data
        const users: CompanyUserChat[] = [
            {
                companyUser: {
                    id: 1,
                    userId: 101,
                    fullName: "John Doe",
                    avatar: "/avatars/john_doe.jpg",
                    avatarFile: {},
                    tagGeneratedByUser: true,
                    updatedAt: "2024-06-30"
                },
                unreadCount: 3,
                isFavourite: true,
                userType: {
                    id: 1,
                    name: "User" // Adjusted from "Employee"
                }
            },
            {
                companyUser: {
                    id: 2,
                    userId: 102,
                    fullName: "Jane Smith",
                    avatar: "/avatars/jane_smith.png",
                    avatarFile: {},
                    tagGeneratedByUser: false,
                    updatedAt: "2024-06-29"
                },
                unreadCount: 0,
                isFavourite: false,
                userType: {
                    id: 2,
                    name: "User" // Adjusted from "Employee"
                }
            },
            {
                companyUser: {
                    id: 3,
                    userId: 103,
                    fullName: "Michael Brown",
                    avatar: "/avatars/michael_brown.jpg",
                    avatarFile: {},
                    tagGeneratedByUser: true,
                    updatedAt: "2024-06-28"
                },
                unreadCount: 1,
                isFavourite: false,
                userType: {
                    id: 3,
                    name: "Admin" // Adjusted from "Manager"
                }
            },
            {
                companyUser: {
                    id: 4,
                    userId: 104,
                    fullName: "Emily Davis",
                    avatar: "/avatars/emily_davis.png",
                    avatarFile: {},
                    tagGeneratedByUser: false,
                    updatedAt: "2024-06-27"
                },
                unreadCount: 2,
                isFavourite: true,
                userType: {
                    id: 4,
                    name: "User" // Adjusted from "Employee"
                }
            },
            {
                companyUser: {
                    id: 5,
                    userId: 105,
                    fullName: "David Wilson",
                    avatar: "/avatars/david_wilson.jpg",
                    avatarFile: {},
                    tagGeneratedByUser: true,
                    updatedAt: "2024-06-26"
                },
                unreadCount: 0,
                isFavourite: false,
                userType: {
                    id: 5,
                    name: "Broker" // Adjusted from "Consultant"
                }
            },
            {
                companyUser: {
                    id: 6,
                    userId: 106,
                    fullName: "Alice Johnson",
                    avatar: "/avatars/alice_johnson.jpg",
                    avatarFile: {},
                    tagGeneratedByUser: true,
                    updatedAt: "2024-06-25"
                },
                unreadCount: 1,
                isFavourite: true,
                userType: {
                    id: 6,
                    name: "Driver"
                }
            },
            {
                companyUser: {
                    id: 7,
                    userId: 107,
                    fullName: "Bob Martinez",
                    avatar: "/avatars/bob_martinez.png",
                    avatarFile: {},
                    tagGeneratedByUser: false,
                    updatedAt: "2024-06-24"
                },
                unreadCount: 4,
                isFavourite: false,
                userType: {
                    id: 7,
                    name: "Driver"
                }
            }
        ];

        return of([...users]);
    }
}