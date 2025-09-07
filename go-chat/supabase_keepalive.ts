import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.GO_CHAT_SUPABASE_API_URL;
const supabaseAnonKey = process.env.GO_CHAT_SUPABASE_ANON_KEY;

async function keepAlive() {
  try {
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error(
        "Missing required environment variables: SUPABASE_URL or SUPABASE_ANON_KEY"
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data, error } = await supabase
      .from("keepalive")
      .select("id, last_ping, message")
      .limit(1)
      .single();

    if (error) {
      throw error;
    }

    const { error: updateError } = await supabase
      .from("keepalive")
      .update({ last_ping: new Date().toISOString() })
      .eq("id", data.id);

    if (updateError) {
      console.warn("Failed to update timestamp:", updateError.message);
    }

    process.exit(0);
  } catch (error) {
    console.error("Keepalive failed:", error);
    process.exit(1);
  }
}

keepAlive();
