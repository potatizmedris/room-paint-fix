import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64, targetColor, colorName, surfaceTargets = ['walls'] } = await req.json();
    
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
    const surfaces: string[] = surfaceTargets as string[];
    const surfaceList = surfaces.join(' and ');
    const keepList: string[] = [];
    if (!surfaces.includes('walls')) keepList.push('walls');
    if (!surfaces.includes('floor')) keepList.push('floor');
    if (!surfaces.includes('ceiling')) keepList.push('ceiling');
    keepList.push('furniture', 'decorations', 'fixtures');
    
    const prompt = `Edit this image: Change ONLY the ${surfaceList} color to ${colorName || targetColor} (hex: ${targetColor}). Keep ${keepList.join(', ')} exactly the same. Only repaint the ${surfaceList}. Make the result look natural and realistic.`;

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

    const data = await response.json();
    console.log('AI response structure:', JSON.stringify({
      hasChoices: !!data.choices,
      choicesLength: data.choices?.length,
      hasMessage: !!data.choices?.[0]?.message,
      hasImages: !!data.choices?.[0]?.message?.images,
      imagesLength: data.choices?.[0]?.message?.images?.length,
      messageContent: data.choices?.[0]?.message?.content?.substring(0, 200),
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
