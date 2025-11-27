// --- INSTRUCTIONS ---
// 1. Create a new Worker in Cloudflare Dashboard.
// 2. Settings > Variables > R2 Bucket Bindings > Add Binding.
//    - Variable name: BUCKET
//    - R2 Bucket: asslogo
// 3. Deploy.
// 4. Copy the Worker URL back to 'services/uploadService.ts'.

export default {
  async fetch(request, env) {
    // 1. Handle CORS (Allow React App to talk to Worker)
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // 2. Handle Upload (POST /upload)
    const url = new URL(request.url);
    if (request.method === "POST" && url.pathname === "/upload") {
      try {
        if (!env.BUCKET) {
           throw new Error("R2 Bucket binding not found. Please bind variable 'BUCKET' to your R2 bucket in Worker Settings.");
        }

        const formData = await request.formData();
        const file = formData.get("file");

        if (!file) {
           return new Response("No file uploaded", { status: 400, headers: corsHeaders });
        }

        // Generate a unique key
        const key = `logos/${Date.now()}-${file.name.replace(/\s+/g, '-')}`;

        // Upload directly to R2 using Native Binding
        await env.BUCKET.put(key, file, {
            httpMetadata: {
                contentType: file.type,
            }
        });

        // Return the key so React can construct the public URL
        return new Response(JSON.stringify({ key }), {
          headers: { 
              "Content-Type": "application/json",
              ...corsHeaders 
          },
        });

      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { 
            status: 500,
            headers: corsHeaders 
        });
      }
    }

    return new Response("Not Found", { status: 404, headers: corsHeaders });
  },
};