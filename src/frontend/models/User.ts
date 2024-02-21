import Booking from "./Booking";
import Config, { Building, LaundryBuilding, Nationshuset } from "../configs/Config";

type AppMetadata = {
    acceptedTerms: boolean,
    allowedSlots: number,
    roles: string[]
    laundryBuilding: LaundryBuilding
}

type UserMetadata = {
    picture: string,
    telephone: string
}

export type ModificationObject = {
    name: string,
    email: string,
    app_metadata: {
        laundryBuilding: LaundryBuilding,
        allowedSlots: number
    },
    user_metadata: {
        telephone: string
    }
}

export type JsonUser = {
    sub: string, // user id, called sub in auth0
    name: string,
    nickname: string,
    email: string,
    email_verified: boolean,
    picture: string,
    app_metadata: AppMetadata,
    user_metadata: UserMetadata,
    updated_at: string
}

export type NewUser = {
    name: string,
    email: string,
    connection: string,
    password: string,
    email_verified: boolean,
    app_metadata: AppMetadata,
    user_metadata: {
        telephone: string
    },
}

export interface UserProfileUpdate {
    email: string;
    user_metadata: {
        telephone: string;
    };
}

export interface UserUpdate {
    name: string,
    email?: string,
    user_metadata?: {
        telephone?: string,
    },
    app_metadata: {
        acceptedTerms?: boolean,
        allowedSlots?: number,
        laundryBuilding: LaundryBuilding,
    },
}

export type UserBookingInfo = {
    name: string,
    email: string,
    user_metadata: {
        telephone: string
    },
}

class User {
    readonly sub: string // user id, called sub in auth0
    readonly name: string
    readonly nickname: string
    readonly email: string
    readonly email_verified: boolean
    readonly picture: string
    app_metadata: AppMetadata
    readonly user_metadata: UserMetadata
    readonly updated_at: Date
    readonly activeBookings: Booking[] = []
    readonly pastBookings: Booking[] = []

    constructor(user: JsonUser, bookings: Booking[] = []) {
        this.sub = user.sub
        this.name = user.name
        this.nickname = user.nickname
        this.email = user.email
        this.email_verified = user.email_verified
        this.picture = user.picture
        this.app_metadata = user.app_metadata
        this.user_metadata = user.user_metadata
        this.updated_at = new Date(user.updated_at)

        bookings.forEach(bookings => {
            if (bookings.startTime > new Date() && bookings.username === this.name) {
                this.activeBookings.push(bookings)
            }
            if (bookings.startTime < new Date() && bookings.username === this.name) {
                this.pastBookings.push(bookings)
            }
        })
    }

    get building(): Building {
        if (!this.app_metadata.roles.includes('admin')) {

            let buildingMatch = this.name.match(/[A-Za-z]+/)?.[0];
            if (!buildingMatch) {
                throw new Error(`No building found in username: ${this.name}`);
            }

            const buildingCode = buildingMatch;


            // Check against all known buildings
            const allBuildings: Building[] = Config.getBuildings;
            const foundBuilding = allBuildings.find((b) => b === buildingCode);

            if (!foundBuilding) {
                throw new Error(`Building not found for username: ${this.name}`);
            }
            return foundBuilding;
        }
        return Nationshuset.NH;
    }

    get roomNumber(): string {
        const roomNumberMatch = this.name.match(/\d+[A-Za-z]?/);
        return roomNumberMatch ? roomNumberMatch[0] : '';
    }

    toJSON() {
        return {
            sub: this.sub,
            name: this.name,
            nickname: this.nickname,
            email: this.email,
            email_verified: this.email_verified,
            picture: this.picture,
            app_metadata: this.app_metadata,
            user_metadata: this.user_metadata,
            updated_at: this.updated_at.toISOString()
        }
    }

    setUserBookings(bookings: Booking[]) {
        this.pastBookings.length = 0 // clears the array
        this.activeBookings.length = 0 // clears the array

        bookings.forEach(bookings => {
            if (bookings.startTime > new Date() && bookings.username === this.name) {
                this.activeBookings.push(bookings)
            }
            if (bookings.startTime < new Date() && bookings.username === this.name) {
                this.pastBookings.push(bookings)
            }
        })
    }

    // Can perhaps be placed in User class
    hasBookingOnDay(day: Date): boolean {
        return this.activeBookings.some(booking => booking.isSameDay(day));
    }
}

export default User