import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Optional authentication - allow guests
    const authHeader = req.headers.get('Authorization');
    let userId = 'guest';
    
    if (authHeader?.startsWith('Bearer ')) {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
      const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
      const supabase = createClient(supabaseUrl, supabaseAnonKey, {
        global: { headers: { Authorization: authHeader } },
      });

      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabase.auth.getUser(token);
      if (user) {
        userId = user.id;
      }
    }

    console.log('User:', userId);

    const { imageBase64, targetColor, colorName, surfaceTarget = 'walls' } = await req.json();
    
    if (!imageBase64 || !targetColor) {
      return new Response(
        JSON.stringify({ error: 'Image and target color are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Build surface-specific prompt
    let surfaceText: string;
    let keepText: string;
    
    if (surfaceTarget === 'both') {
      surfaceText = 'walls and ceiling';
      keepText = 'floor, furniture, decorations, fixtures';
    } else if (surfaceTarget === 'ceiling') {
      surfaceText = 'ceiling';
      keepText = 'walls, floor, furniture, decorations, fixtures';
    } else {
      surfaceText = 'walls';
      keepText = 'ceiling, floor, furniture, decorations, fixtures';
    }
    
    const prompt = `Edit this image: Change ONLY the ${surfaceText} color to ${colorName || targetColor} (hex: ${targetColor}). Keep ${keepText} exactly the same. Only repaint the ${surfaceText}. Make the result look natural and realistic.`;

    console.log('Sending request to AI gateway with prompt:', prompt);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-image',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: prompt,
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageBase64,
                },
              },
            ],
          },
        ],
        modalities: ['image', 'text'],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Usage limit reached. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      return new Response(
        JSON.stringify({ error: `Failed to process image: ${errorText}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const responseText = await response.text();
    if (!responseText) {
      console.error('AI gateway returned empty response');
      return new Response(
        JSON.stringify({ error: 'AI service returned an empty response. Please try again.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse AI response:', responseText.substring(0, 500));
      return new Response(
        JSON.stringify({ error: 'Invalid response from AI service. Please try again.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const message = data.choices?.[0]?.message;
    console.log('AI response structure:', JSON.stringify({
      hasChoices: !!data.choices,
      choicesLength: data.choices?.length,
      messageKeys: message ? Object.keys(message) : [],
      hasImages: !!message?.images,
      imagesLength: message?.images?.length,
      contentType: typeof message?.content,
      contentLength: typeof message?.content === 'string' ? message.content.length : 0,
      contentPreview: typeof message?.content === 'string' ? message.content.substring(0, 300) : JSON.stringify(message?.content)?.substring(0, 300),
      finishReason: data.choices?.[0]?.finish_reason,
    }));

    const editedImageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!editedImageUrl) {
      console.error('No image in response. Full response:', JSON.stringify(data).substring(0, 1000));
      return new Response(
        JSON.stringify({ 
          error: 'The AI did not generate an image. Please try again with a clearer photo of a wall.',
          details: data.choices?.[0]?.message?.content || 'No response content'
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        imageUrl: editedImageUrl,
        message: data.choices?.[0]?.message?.content || 'Wall color changed successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in change-wall-color function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
