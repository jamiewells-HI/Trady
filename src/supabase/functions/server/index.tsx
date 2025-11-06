import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

app.use("*", cors());
app.use("*", logger(console.log));

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

// Initialize storage bucket for images
const BUCKET_NAME = "make-97eaeffe-listings";

async function initializeBucket() {
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === BUCKET_NAME);
    
    if (!bucketExists) {
      await supabase.storage.createBucket(BUCKET_NAME, {
        public: false,
        fileSizeLimit: 10485760, // 10MB
      });
      console.log(`Created storage bucket: ${BUCKET_NAME}`);
    }
  } catch (error) {
    console.log(`Error initializing storage bucket: ${error}`);
  }
}

// Initialize bucket on startup
initializeBucket();

// Health check
app.get("/make-server-97eaeffe/health", (c) => {
  return c.json({ status: "ok" });
});

// Upload image (requires auth)
app.post("/make-server-97eaeffe/upload-image", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const formData = await c.req.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return c.json({ error: "No file provided" }, 400);
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${crypto.randomUUID()}.${fileExt}`;
    
    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = new Uint8Array(arrayBuffer);

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, fileBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.log(`Error uploading file: ${error.message}`);
      return c.json({ error: "Failed to upload file" }, 500);
    }

    // Create signed URL (valid for 1 year)
    const { data: signedUrlData } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(fileName, 31536000);

    return c.json({ 
      success: true, 
      path: fileName,
      url: signedUrlData?.signedUrl 
    });
  } catch (error) {
    console.log(`Error in upload-image endpoint: ${error}`);
    return c.json({ error: "Failed to upload image" }, 500);
  }
});

// Get all listings
app.get("/make-server-97eaeffe/listings", async (c) => {
  try {
    const listings = await kv.getByPrefix("listing:");
    return c.json({ listings });
  } catch (error) {
    console.log(`Error fetching listings: ${error}`);
    return c.json({ error: "Failed to fetch listings" }, 500);
  }
});

// Get listing by ID
app.get("/make-server-97eaeffe/listings/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const listing = await kv.get(`listing:${id}`);
    
    if (!listing) {
      return c.json({ error: "Listing not found" }, 404);
    }
    
    return c.json({ listing });
  } catch (error) {
    console.log(`Error fetching listing: ${error}`);
    return c.json({ error: "Failed to fetch listing" }, 500);
  }
});

// Create new listing (requires auth)
app.post("/make-server-97eaeffe/listings", async (c) => {
  try {
    // Verify user authentication
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const body = await c.req.json();
    const listingId = crypto.randomUUID();
    
    const listing = {
      id: listingId,
      userId: user.id,
      title: body.title,
      description: body.description,
      category: body.category,
      condition: body.condition,
      lookingFor: body.lookingFor,
      images: body.images || [],
      createdAt: new Date().toISOString(),
    };

    await kv.set(`listing:${listingId}`, listing);
    
    return c.json({ listing }, 201);
  } catch (error) {
    console.log(`Error creating listing: ${error}`);
    return c.json({ error: "Failed to create listing" }, 500);
  }
});

// Get user's saved listings
app.get("/make-server-97eaeffe/saved-listings", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const savedListings = await kv.get(`saved:${user.id}`) || [];
    return c.json({ savedListings });
  } catch (error) {
    console.log(`Error fetching saved listings: ${error}`);
    return c.json({ error: "Failed to fetch saved listings" }, 500);
  }
});

// Save a listing
app.post("/make-server-97eaeffe/saved-listings/:id", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const listingId = c.req.param("id");
    const savedListings = await kv.get(`saved:${user.id}`) || [];
    
    if (!savedListings.includes(listingId)) {
      savedListings.push(listingId);
      await kv.set(`saved:${user.id}`, savedListings);
    }
    
    return c.json({ success: true });
  } catch (error) {
    console.log(`Error saving listing: ${error}`);
    return c.json({ error: "Failed to save listing" }, 500);
  }
});

// Remove saved listing
app.delete("/make-server-97eaeffe/saved-listings/:id", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const listingId = c.req.param("id");
    const savedListings = await kv.get(`saved:${user.id}`) || [];
    const filtered = savedListings.filter((id: string) => id !== listingId);
    
    await kv.set(`saved:${user.id}`, filtered);
    
    return c.json({ success: true });
  } catch (error) {
    console.log(`Error removing saved listing: ${error}`);
    return c.json({ error: "Failed to remove saved listing" }, 500);
  }
});

// Get user's trade history
app.get("/make-server-97eaeffe/history", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const history = await kv.get(`history:${user.id}`) || [];
    return c.json({ history });
  } catch (error) {
    console.log(`Error fetching history: ${error}`);
    return c.json({ error: "Failed to fetch history" }, 500);
  }
});

// Sign up new user
app.post("/make-server-97eaeffe/signup", async (c) => {
  try {
    const body = await c.req.json();
    
    const { data, error } = await supabase.auth.admin.createUser({
      email: body.email,
      password: body.password,
      user_metadata: { 
        name: body.name,
        location: body.location || "",
        phone: body.phone || "",
      },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.log(`Error signing up user: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ user: data.user }, 201);
  } catch (error) {
    console.log(`Error during signup: ${error}`);
    return c.json({ error: "Failed to sign up" }, 500);
  }
});

// Send message to listing owner (requires auth)
app.post("/make-server-97eaeffe/messages", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: "Unauthorized - please sign in to send messages" }, 401);
    }

    const body = await c.req.json();
    const messageId = crypto.randomUUID();
    
    const message = {
      id: messageId,
      listingId: body.listingId,
      senderId: user.id,
      senderName: user.user_metadata?.name || user.email,
      recipientId: body.recipientId,
      subject: body.subject,
      message: body.message,
      createdAt: new Date().toISOString(),
      read: false,
    };

    // Store the message
    await kv.set(`message:${messageId}`, message);
    
    // Add to recipient's inbox
    const recipientInbox = await kv.get(`inbox:${body.recipientId}`) || [];
    recipientInbox.unshift(messageId);
    await kv.set(`inbox:${body.recipientId}`, recipientInbox);
    
    // Add to sender's sent messages
    const senderSent = await kv.get(`sent:${user.id}`) || [];
    senderSent.unshift(messageId);
    await kv.set(`sent:${user.id}`, senderSent);
    
    return c.json({ success: true, message }, 201);
  } catch (error) {
    console.log(`Error sending message: ${error}`);
    return c.json({ error: "Failed to send message" }, 500);
  }
});

// Get user's inbox (requires auth)
app.get("/make-server-97eaeffe/messages", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const messageIds = await kv.get(`inbox:${user.id}`) || [];
    const messages = await kv.mget(messageIds.map((id: string) => `message:${id}`));
    
    return c.json({ messages });
  } catch (error) {
    console.log(`Error fetching messages: ${error}`);
    return c.json({ error: "Failed to fetch messages" }, 500);
  }
});

// Create trade offer (requires auth)
app.post("/make-server-97eaeffe/offers", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: "Unauthorized - please sign in to make an offer" }, 401);
    }

    const body = await c.req.json();
    const offerId = crypto.randomUUID();
    
    const offer = {
      id: offerId,
      listingId: body.listingId,
      offererId: user.id,
      offererName: user.user_metadata?.name || user.email,
      recipientId: body.recipientId,
      offeredItems: body.offeredItems,
      message: body.message,
      status: "pending", // pending, accepted, rejected
      createdAt: new Date().toISOString(),
    };

    // Store the offer
    await kv.set(`offer:${offerId}`, offer);
    
    // Add to user's offers made
    const userOffers = await kv.get(`offers-made:${user.id}`) || [];
    userOffers.unshift(offerId);
    await kv.set(`offers-made:${user.id}`, userOffers);
    
    // Add to recipient's offers received
    const recipientOffers = await kv.get(`offers-received:${body.recipientId}`) || [];
    recipientOffers.unshift(offerId);
    await kv.set(`offers-received:${body.recipientId}`, recipientOffers);
    
    return c.json({ success: true, offer }, 201);
  } catch (error) {
    console.log(`Error creating offer: ${error}`);
    return c.json({ error: "Failed to create offer" }, 500);
  }
});

// Get user's offers (requires auth)
app.get("/make-server-97eaeffe/offers", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const offersMadeIds = await kv.get(`offers-made:${user.id}`) || [];
    const offersReceivedIds = await kv.get(`offers-received:${user.id}`) || [];
    
    const offersMade = await kv.mget(offersMadeIds.map((id: string) => `offer:${id}`));
    const offersReceived = await kv.mget(offersReceivedIds.map((id: string) => `offer:${id}`));
    
    return c.json({ offersMade, offersReceived });
  } catch (error) {
    console.log(`Error fetching offers: ${error}`);
    return c.json({ error: "Failed to fetch offers" }, 500);
  }
});

Deno.serve(app.fetch);