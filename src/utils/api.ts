import { projectId, publicAnonKey } from "./supabase/info";

const BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-97eaeffe`;

interface RequestOptions {
  method?: string;
  body?: any;
  accessToken?: string;
}

async function request(endpoint: string, options: RequestOptions = {}) {
  const { method = "GET", body, accessToken } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken || publicAnonKey}`,
  };

  const config: RequestInit = {
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      console.error(`API Error (${endpoint}):`, data.error || response.statusText);
      throw new Error(data.error || "Request failed");
    }

    return data;
  } catch (error) {
    console.error(`Network Error (${endpoint}):`, error);
    throw error;
  }
}

export const api = {
  // Listings
  getListings: () => request("/listings"),
  getListing: (id: string) => request(`/listings/${id}`),
  createListing: (listing: any, accessToken: string) =>
    request("/listings", { method: "POST", body: listing, accessToken }),

  // Image Upload
  uploadImage: async (file: File, accessToken: string) => {
    const formData = new FormData();
    formData.append("file", file);
    
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-97eaeffe/upload-image`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      }
    );
    
    const data = await response.json();
    if (!response.ok) {
      console.error("Upload error:", data.error);
      throw new Error(data.error || "Upload failed");
    }
    
    return data;
  },

  // Saved Listings
  getSavedListings: (accessToken: string) =>
    request("/saved-listings", { accessToken }),
  saveListing: (id: string, accessToken: string) =>
    request(`/saved-listings/${id}`, { method: "POST", accessToken }),
  removeSavedListing: (id: string, accessToken: string) =>
    request(`/saved-listings/${id}`, { method: "DELETE", accessToken }),

  // Messages
  sendMessage: (messageData: any, accessToken: string) =>
    request("/messages", { method: "POST", body: messageData, accessToken }),
  getMessages: (accessToken: string) =>
    request("/messages", { accessToken }),

  // Offers
  createOffer: (offerData: any, accessToken: string) =>
    request("/offers", { method: "POST", body: offerData, accessToken }),
  getOffers: (accessToken: string) =>
    request("/offers", { accessToken }),

  // History
  getHistory: (accessToken: string) => request("/history", { accessToken }),

  // Auth
  signup: (userData: { email: string; password: string; name: string }) =>
    request("/signup", { method: "POST", body: userData }),
};