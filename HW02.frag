#ifdef GL_ES
precision mediump float;
#endif

vec2 uv;

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

uniform float u_density_texture;
uniform float u_density_picture;

uniform float u_speed_x;
uniform float u_speed_y;
uniform bool u_still;
uniform bool u_mouse_pressed;

uniform vec3 u_rgb;

uniform vec3 u_color_ink;
uniform vec3 u_color_background;

uniform sampler2D u_texture_base;
uniform sampler2D u_texture_0;
uniform sampler2D u_texture_1;
uniform sampler2D u_texture_2;
uniform sampler2D u_texture_3;
uniform sampler2D u_texture_4;
uniform sampler2D u_texture_5;

uniform sampler2D u_title;
uniform sampler2D u_guide;

uniform sampler2D u_intro_background;
uniform sampler2D u_intro_title;
uniform sampler2D u_intro_content;

#define PI 3.1415926535897932384626433832795

// -------------------- hash -------------------- //

float hash(in float n)
{
    return fract(sin(n) * 40000.0);
}

// -------------------- random2 -------------------- //

vec2 random2(vec2 p)
{
    return fract(sin(vec2(dot(p,vec2(127.1, 311.7)),
                                   dot(p,vec2(269.5, 183.3)))) * 43758.5453);
}

// -------------------- voronoi -------------------- //

vec3 voronoi(in vec2 x)
{
    vec2 n = floor(x);
    vec2 f = fract(x);

    vec2 mg, mr;
    float md = 8.0;
    for (int j = -1; j <= 1; j++)
    {
        for (int i = -1; i <= 1; i++)
        {
            vec2 g = vec2(float(i), float(j));
            vec2 o = random2(n + g);
            o = 0.5 + 0.5 * sin(u_time + 6.2831 * o);

            vec2 r = g + o - f;
            float d = dot(r,r);

            if( d < md ) {
                md = d;
                mr = r;
                mg = g;
            }
        }
    }

    md = 8.0;
    for (int j = -2; j <= 2; j++)
    {
        for (int i = -2; i <= 2; i++)
        {
            vec2 g = mg + vec2(float(i), float(j));
            vec2 o = random2(n + g);
            o = 0.5 + 0.5 * sin(u_time + 6.2831 * o);

            vec2 r = g + o - f;

            if (dot(mr-r, mr-r) > 0.00001)
            {
                md = min(md, dot(0.5 * (mr + r), normalize(r - mr)));
            }
        }
    }
    return vec3(md, mr);
}

// -------------------- colorTransform -------------------- //

vec3 colorTransform(vec3 color)
{
    color.xyz /= 255.0;
    return color;
}

// -------------------- mouseEffect -------------------- //

float mouseEffect(vec2 uv, vec2 mouse, float size)
{
    float dist = length(uv - mouse);
    return smoothstep(size, size, dist);
}

// -------------------- main -------------------- //

void main()
{
    uv = gl_FragCoord.xy / u_resolution.xy;
    uv.x *= u_resolution.x / u_resolution.y;

    vec2 uv_mouse = u_mouse / u_resolution.xy;
    uv_mouse.x *= u_resolution.x / u_resolution.y;

    float highlight_size = 0.05;
    float texture_mouse = mouseEffect(uv, uv_mouse, highlight_size);

    vec2 uv_title = vec2(uv.x + 0.45, uv.y + 0.45);
    uv_title.y = 1.0 - uv_title.y;
	vec4 texture_title = texture2D(u_title, uv_title);

    vec2 uv_guide = vec2(uv.x + 0.45, uv.y - 0.45);
    uv_guide.y = 1.0 - uv_guide.y;
	vec4 texture_guide = texture2D(u_guide, uv_guide);

    vec2 uv_intro_background = uv;
    vec4 texture_intro_background = texture2D(u_intro_background, uv_intro_background);

    vec2 uv_intro_title = vec2(uv.x + 0.45, uv.y + 0.45);
    uv_intro_title.y = 1.0 - uv_intro_title.y;
	vec4 texture_intro_title = texture2D(u_intro_title, uv_intro_title);

    vec2 uv_intro_content = vec2(uv.x + 0.45, uv.y - 0.45);
    uv_intro_content.y = 1.0 - uv_intro_content.y;
	vec4 texture_intro_content = texture2D(u_intro_content, uv_intro_content);

    if (u_still) { uv = uv; }
    else
    {
        uv.x -= u_time * u_speed_x;
        uv.y -= u_time * u_speed_y;
    }

    vec4 graphic;

    // -------------------------------------------------- //

    // vec2 uv_graphic = uv * 3.0;
    // vec3 graphic_voronoi = voronoi(uv_graphic);

    // graphic.rgb = graphic_voronoi.x * (0.5 + 0.5 * sin(64.0 * graphic_voronoi.x)) * vec3(1.0);
    // graphic.rgb = mix(vec3(1.0),
    //                   graphic.rgb,
    //                   smoothstep(0.1, 0.02, graphic_voronoi.x));

    // -------------------------------------------------- //

    // vec2 uv_graphic = uv * 6.0;

    // vec2 i_st = floor(uv_graphic);
    // vec2 f_st = fract(uv_graphic);

    // float m_dist = 1.;
    // for (int j = -1; j <= 1; j++)
    // {
    //     for (int i = -1; i <= 1; i++)
    //     {
    //         vec2 neighbor = vec2(float(i), float(j));

    //         vec2 offset = random2(i_st + neighbor);
    //         offset = 0.5 + 0.5 * sin(u_time + 6.2 * offset);

    //         vec2 pos = neighbor + offset - f_st;

    //         float dist = length(pos);

    //         m_dist = min(m_dist, m_dist * dist);
    //     }
    // }

    // graphic += step(0.060, m_dist);

    // -------------------------------------------------- //

    vec2 uv_texture = fract(floor(u_density_texture) * uv);

    float shading;

    if (u_rgb.r == 1.0) { shading += texture2D(u_texture_base, fract(floor(u_density_picture) * uv)).r; }
    if (u_rgb.g == 1.0) { shading += texture2D(u_texture_base, fract(floor(u_density_picture) * uv)).g; }
    if (u_rgb.b == 1.0) { shading += texture2D(u_texture_base, fract(floor(u_density_picture) * uv)).b; }

    // if (u_rgb.r == 1.0) { shading += graphic.r; }
    // if (u_rgb.g == 1.0) { shading += graphic.g; }
    // if (u_rgb.b == 1.0) { shading += graphic.b; }
    
    if (u_rgb.r + u_rgb.g + u_rgb.b >= 1.0) { shading /= u_rgb.r + u_rgb.g + u_rgb.b; }
    else { shading = 1.0; }

    vec4 texture;

    float step = 1.0 / 6.0;

    if (shading <= step)
    {
        texture = texture2D(u_texture_5, uv_texture);
    }
    if (shading > step && shading <= 2.0 * step)
    {
        texture = texture2D(u_texture_4, uv_texture);
    }
    if (shading > 2.0 * step && shading <= 3.0 * step)
    {
        texture = texture2D(u_texture_3, uv_texture);
    }
    if (shading > 3.0 * step && shading <= 4.0 * step)
    {
        texture = texture2D(u_texture_2, uv_texture);
    }
    if (shading > 4.0 * step && shading <= 5.0 * step)
    {
        texture = texture2D(u_texture_1, uv_texture);
    }
    if (shading > 5.0 * step)
    {
        texture = texture2D(u_texture_0, uv_texture);
    }

    // -------------------------------------------------- //

    vec4 color_ink = vec4(colorTransform(u_color_ink), 1.0);
    vec4 color_background = vec4(colorTransform(u_color_background), 1.0);

    vec4 shader_mouse = mix(mix(color_background, color_ink, texture), 
                            mix(color_ink, color_background, texture),
                            texture_mouse);

    vec4 shader_title = mix(mix(color_ink, color_background, texture), 
                           mix(color_background, color_ink, texture),
                           texture_title);

    vec4 shader_guide = mix(mix(color_ink, color_background, texture), 
                            mix(color_background, color_ink, texture),
                            texture_guide);

    vec4 shader_intro_background = mix(vec4(0.0, 0.0, 0.0, 0.0),
                                       color_ink,
                                       texture_intro_background);

    vec4 shader_intro_title = mix(vec4(0.0, 0.0, 0.0, 0.0),
                                       color_background,
                                       texture_intro_title);

    vec4 shader_intro_content = mix(vec4(0.0, 0.0, 0.0, 0.0),
                                    color_background,
                                    texture_intro_content);

    vec4 shader = mix(shader_mouse, shader_title, texture_title);
    shader = mix(shader, shader_guide, texture_guide);

    vec4 shader_intro = mix(shader, shader_intro_background, texture_intro_background);
    shader_intro = mix(shader_intro, shader_intro_title, texture_intro_title);
    shader_intro = mix(shader_intro, shader_intro_content, texture_intro_content);

    if (uv_mouse.x <= 0.1) { gl_FragColor = shader_intro; }
    else { gl_FragColor = shader; }
}