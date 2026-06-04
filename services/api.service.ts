import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { apiClient, getAuthHeaders } from "@/lib/api";
import { Product, Order, UserProfile, Address } from "@/types";

export class APIService {
  // Authentication & Session Porting
  static handleSignOut() {
    Cookies.remove("jwt_token");
    Cookies.remove("customer_name");
    Cookies.remove("email");
    Cookies.remove("customer_id");
    Cookies.remove("location");
    Cookies.remove("cart_count");
    localStorage.clear();
    sessionStorage.clear();
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("clearCart"));
      window.location.href = "/login";
    }
  }

  static async sendOTP(phoneNumber: string): Promise<any> {
    const res = await apiClient.post("/send_otp", { phone_number: phoneNumber });
    return res.data;
  }

  static async checkCustomer(phoneNumber: string): Promise<{ exists: boolean }> {
    const res = await apiClient.post("/check_customer", { phone_number: phoneNumber });
    return res.data;
  }

  static async verifyOTPAndLogin(phoneNumber: string, otp: string): Promise<any> {
    const res = await apiClient.post("/login_otp", { phone_number: phoneNumber, otp });
    return res.data;
  }

  static async loginWithPassword(phoneNumber: string, passwordHash: string): Promise<any> {
    const res = await apiClient.post("/login_password", {
      phone_number: phoneNumber,
      password: passwordHash,
    });
    return res.data;
  }

  static async googleAuth(token: string): Promise<any> {
    const res = await apiClient.post("/googleauth", { token });
    return res.data;
  }

  static async googleAuthSignup(phoneNumber: string, token: string, otp: string): Promise<any> {
    const res = await apiClient.post("/googleauthsignup", {
      phone_number: phoneNumber,
      token,
      otp,
    });
    return res.data;
  }

  static async createPassword(phoneNumber: string, passwordHash: string, otp: string): Promise<any> {
    const res = await apiClient.post("/create_password", {
      phone_number: phoneNumber,
      password: passwordHash,
      otp,
    });
    return res.data;
  }

  // Profile management
  static async updateProfile(profileData: any): Promise<any> {
    const res = await apiClient.post("/update_profile", profileData, {
      headers: getAuthHeaders(),
    });
    return res.data;
  }

  // Logistics & Locations
  static async checkDTDCAvailability(pincode: string): Promise<any> {
    const res = await apiClient.get("/dtdc/check", {
      params: { pincode },
      headers: getAuthHeaders(),
    });
    return res.data;
  }

  // Reminders Management
  static async getAllReminders(): Promise<any[]> {
    const res = await apiClient.get("/all_reminders", {
      headers: getAuthHeaders(),
    });
    return res.data;
  }

  static async addReminder(reminderData: any): Promise<any> {
    const res = await apiClient.post("/add_reminder", reminderData, {
      headers: getAuthHeaders(),
    });
    return res.data;
  }

  static async deleteReminder(reminderId: string | number): Promise<any> {
    const res = await apiClient.post(
      "/delete_reminder",
      { reminder_id: reminderId },
      { headers: getAuthHeaders() }
    );
    return res.data;
  }

  static async markReminderAsDone(reminderId: string | number): Promise<any> {
    const res = await apiClient.post(
      "/mark_as_taken",
      { reminder_id: reminderId },
      { headers: getAuthHeaders() }
    );
    return res.data;
  }

  // Orders & Tracks
  static async getOrders(page = 1, search = "", perPage = 10): Promise<{ orders: any[] }> {
    const res = await apiClient.get("/orders", {
      params: { page, search, per_page: perPage },
      headers: getAuthHeaders(),
    });
    return res.data;
  }

  static async getOrderTracking(trackingId: string | number): Promise<any> {
    const res = await apiClient.post(`/order-tracking/${trackingId}`, {}, {
      headers: getAuthHeaders(),
    });
    return res.data;
  }

  // Offers & Rewards
  static async getOffers(page = 1): Promise<any> {
    const res = await apiClient.get("/offers", { params: { page } });
    return res.data;
  }

  static async getRewardsSummary(): Promise<any> {
    const res = await apiClient.get("/rewards-summary", {
      headers: getAuthHeaders(),
    });
    return res.data;
  }

  static async getRewardsTransactions(page = 1): Promise<any> {
    const res = await apiClient.get("/rewards", {
      params: { page },
      headers: getAuthHeaders(),
    });
    return res.data;
  }
}
