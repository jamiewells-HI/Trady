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

// Health check
app.get("/make-server-97eaeffe/health", (c) => {
  return c.json({ status: "ok" });
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

Deno.serve(app.fetch);
