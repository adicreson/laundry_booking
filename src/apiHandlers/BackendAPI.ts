import axios from "axios";
import Booking, {JsonBooking, NewBooking} from "../classes/Booking";
import User, {NewUser} from "../classes/User";
import {LaundryBuilding} from "../configs/Config";

// This class is used to communicate with the backend API from the frontend
class BackendAPI {
    static async fetchBooking(id: string): Promise<Booking> {
        return new Booking((await axios.get(`/api/bookings/${id}`)).data)
    }

    static async fetchBookingsForBuilding(building: LaundryBuilding): Promise<Booking[]> {
        const bookings = (await axios.get(`/api/bookings/laundrybuilding/${building}`)).data;
        return bookings.map((booking: JsonBooking) => new Booking(booking));
    }

    static async fetchBookingsByUser(username: string): Promise<Booking[]> {
        const bookings = (await axios.get(`/api/bookings?username=${username}`)).data
        return bookings.map((booking: JsonBooking) => new Booking(booking))
    }

    static async postBooking(booking: NewBooking): Promise<Booking> {
        return new Booking((await axios.post("/api/bookings", booking)).data)
    }

    static async deleteBooking(id: string) {
        return new Booking((await axios.delete(`/api/bookings/${id}`)).data)
    }

    static async fetchBookings(): Promise<Booking[]> {
        const bookings = (await axios.get("/api/bookings")).data
        return bookings.map((booking: JsonBooking) => new Booking(booking))
    }

    // ------------------ USER RELATED ------------------
    static async fetchUser(id: string): Promise<User> {
        return await axios.get("api/users/" + id)
    }

    static async createUser(newUser: NewUser): Promise<User> {
        return await axios.post("api/users", newUser)
    }

    static async deleteUser(id: string) {
        return await axios.delete("api/users/" + id)
    }
}

export default BackendAPI;