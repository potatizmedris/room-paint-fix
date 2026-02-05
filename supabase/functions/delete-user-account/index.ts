import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the authorization header from the request
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "No authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create a Supabase client with the user's token
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Client with user's auth to get their ID
    const supabaseUser = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Get the authenticated user
    const { data: { user }, error: userError } = await supabaseUser.auth.getUser();

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "User not authenticated" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create admin client to delete the user
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // 1. Get all favorites with photo URLs for this user
    const { data: favorites, error: favoritesError } = await supabaseAdmin
      .from("favorites")
      .select("id, photo_url")
      .eq("user_id", user.id);

    if (favoritesError) {
      console.error("Error fetching favorites:", favoritesError);
      // Continue with deletion even if we can't fetch favorites
    }

    // 2. Delete photos from storage
    if (favorites && favorites.length > 0) {
      const photoPaths = favorites
        .filter((f) => f.photo_url)
        .map((f) => f.photo_url as string);

      if (photoPaths.length > 0) {
        const { error: storageError } = await supabaseAdmin.storage
          .from("favorite-photos")
          .remove(photoPaths);

        if (storageError) {
          console.error("Error deleting photos from storage:", storageError);
          // Continue with deletion even if storage cleanup fails
        } else {
          console.log(`Deleted ${photoPaths.length} photos from storage`);
        }
      }
    }

    // 3. Delete all favorites for this user
    const { error: deleteFavoritesError } = await supabaseAdmin
      .from("favorites")
      .delete()
      .eq("user_id", user.id);

    if (deleteFavoritesError) {
      console.error("Error deleting favorites:", deleteFavoritesError);
      // Continue with account deletion even if favorites cleanup fails
    } else {
      console.log(`Deleted favorites for user ${user.id}`);
    }

    // 4. Delete the user from auth.users
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id);

    if (deleteError) {
      console.error("Error deleting user:", deleteError);
      return new Response(
        JSON.stringify({ error: "Failed to delete account" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Successfully deleted user account: ${user.id}`);

    return new Response(
      JSON.stringify({ success: true, message: "Account deleted successfully" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to delete account" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
