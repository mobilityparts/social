import Anthropic from '@anthropic-ai/sdk';
import { FALLBACK_IMAGES } from './config.js';

const SHOT_STYLES = [
  'close-up of mechanic hands with a specific tool working on a clearly identifiable automotive part, natural fluorescent workshop light',
  'side-by-side on a metal workbench: worn/damaged part next to its brand-new replacement, flat neutral light, no background clutter',
  'overhead flat-lay of parts and tools laid out on a clean shop rag before installation, workbench surface showing real use',
  'wide shot of a car on a hydraulic lift in a European garage, mechanic visible from waist down or from behind only',
  'tight shot of a specific part mid-removal or mid-installation, identifiable European vehicle visible in background (Golf, Peugeot, Sprinter…)',
  'professional stockroom: rows of plain cardboard boxes on steel shelving, reference labels visible, realistic warehouse lighting',
  'mechanic checking a reference on a phone or tablet beside an open car hood — documentary, caught-in-the-act framing',
  'new part partially out of its plain unbranded cardboard packaging on a workbench, garage environment soft-focused behind',
  'educational close-up of a failed/worn part showing damage clearly — cracked rubber, scored metal, rust — diagnostic shot',
  'early morning garage scene: parts boxes stacked near a van or workbench, daylight just coming through the open roll-up door',
];

async function buildImagePrompt(captionText, pillar, postCount) {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const shotStyle = SHOT_STYLES[postCount % SHOT_STYLES.length];

  const msg = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 280,
    messages: [{
      role: 'user',
      content: `You are writing a photo prompt for a B2B automotive Instagram account. Write a FLUX image prompt for post #${postCount + 1} from Mobility Parts (auto parts distributor, Brussels).

Post content: ${captionText.slice(0, 200)}
Pillar: ${pillar.label}
Required shot: ${shotStyle}

GOAL: The photo must look like a mechanic pulled out his phone mid-job and snapped it — candid, unposed, documentary. NOT a professional photoshoot. Viewers should feel like they are standing in a real Belgian garage watching work happen.

CRITICAL — MATCH THE POST CONTENT: Read the post content above carefully and pick a visual subject that directly illustrates it. The viewer must look at the photo and immediately understand what the post is about. Extract the specific part, action, or scenario from the caption and shoot that — not a generic garage.

FULL DOMAIN OF POSSIBLE SUBJECTS — draw from the whole list depending on post content:
Engine internals: piston, connecting rod, crankshaft, camshaft, valves, head gasket, cylinder head, engine block, injector, fuel rail, intake manifold, EGR valve, turbocharger, intercooler, oil sump, timing chain
Filtration: oil filter, air filter, cabin filter, fuel filter, hydraulic filter — Mann-Filter, Mahle, WIX
Brakes & safety: brake disc, brake pad, brake caliper, brake hose, ABS sensor, brake fluid reservoir, handbrake cable, master cylinder
Suspension & steering: shock absorber, coil spring, strut, ball joint, tie rod end, steering rack, sway bar link, wheel bearing, hub, CV joint, driveshaft
Transmission & clutch: clutch disc, pressure plate, flywheel, clutch kit, gearbox, gear lever, differential
Electrical & sensors: alternator, starter motor, battery, lambda sensor, MAF sensor, crankshaft position sensor, temperature sensor, throttle body, fuse box, relay
Cooling system: radiator, water pump, thermostat, coolant reservoir, radiator hose, cooling fan, heater matrix
Exhaust: catalytic converter, DPF/FAP filter, O2 sensor, exhaust manifold, flexible joint, muffler
Bodywork: bumper, door panel, wing mirror, headlight, taillight, windscreen wiper, bonnet, door handle
Tyres & wheels: tyre, alloy wheel, hub cap, lug nuts, valve, tyre pressure gauge, wheel balancing weight
Lubrication & fluids: oil drum, oil gun, coolant jug, brake fluid bottle, power steering fluid
Workshop equipment: hydraulic lift, diagnostic scan tool, oscilloscope, torque wrench, brake bleeder kit, jack stands, compressor, tyre changer
Logistics: parts delivery van arriving, mechanic checking a delivery note, stockroom shelves with boxes, parts laid out for a job

WHAT TO SHOOT: Pick the single most relevant subject from the list above based on the post content. Show it in a real active workshop. The part should look genuinely used — slightly greasy, dusty, or mid-installation. Tools nearby. European vehicles when visible (Golf, Peugeot 308, Sprinter, Renault Master, Citroën Berlingo, Iveco Daily).

PEOPLE: Mechanics can appear naturally — hands working on a part, a mechanic crouching beside a car, a colleague in the background. Real people make the photo feel authentic. Faces are fine if they appear naturally in the shot. No posing, no looking at the camera — caught mid-task.

ENVIRONMENT: Real Belgian independent garage — concrete floor with oil stains, steel tool chest with scratches, hydraulic lift with worn paint, pegboard with hanging tools, cardboard boxes stacked. Everything slightly worn and used, not showroom clean.

LIGHTING: Fluorescent tube overhead or daylight through a half-open roll-up door. Honest, flat, functional light. No dramatic shadows, no studio strobes, no golden hour, no atmospheric effects.

PHOTO FEEL — this is the most important part:
- Looks like it was shot on a mechanic's smartphone (iPhone or Samsung), not a camera
- Slight natural noise/grain from indoor lighting
- Honest colours, zero grading or filters
- Framing is slightly imperfect — not centered to perfection
- Real imperfections: slight depth-of-field variation, natural motion
- Feels like it was taken quickly between two tasks

HARD RULES:
- ONE clear subject — a specific part or a specific action
- NO logos or brand text on any visible surface — all boxes are plain unbranded cardboard
- NOT illustrated, NOT CGI, NOT cinematic, NOT stock photo aesthetic
- NO artificial smoke, fog, steam or lens flares
- Square 1:1 crop

Reply with ONLY the prompt — 2-3 grounded sentences. Name the exact part. Name the exact environment detail. Make it feel lived-in.`,
    }],
  });
  return msg.content[0].text.trim();
}

async function generateWithFluxPro(prompt) {
  const res = await fetch('https://api.replicate.com/v1/models/black-forest-labs/flux-1.1-pro/predictions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}`,
      'Content-Type': 'application/json',
      Prefer: 'wait=60',
    },
    body: JSON.stringify({
      input: {
        prompt,
        aspect_ratio: '1:1',
        output_format: 'jpg',
        output_quality: 90,
        safety_tolerance: 2,
        prompt_upsampling: true,
      },
    }),
  });

  if (!res.ok) throw new Error(`Replicate ${res.status}: ${await res.text()}`);

  const prediction = await res.json();
  if (prediction.status === 'succeeded') return prediction.output;
  return await pollReplicate(prediction.urls.get);
}

async function pollReplicate(url, maxAttempts = 30) {
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise(r => setTimeout(r, 3000));
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}` },
    });
    const data = await res.json();
    if (data.status === 'succeeded') return data.output;
    if (data.status === 'failed') throw new Error(`Replicate failed: ${data.error}`);
  }
  throw new Error('Replicate timeout');
}

export async function generateImage({ pillar, captionText, postCount }) {
  if (process.env.REPLICATE_API_TOKEN) {
    try {
      const prompt = await buildImagePrompt(captionText || '', pillar, postCount || 0);
      console.log(`  FLUX Pro prompt: ${prompt.slice(0, 90)}...`);
      const imageUrl = await generateWithFluxPro(prompt);
      return { imageUrl, prompt, provider: 'flux-pro' };
    } catch (err) {
      console.warn(`  ⚠ FLUX Pro: ${err.message}`);
    }
  }

  const imageUrl = FALLBACK_IMAGES[Math.floor(Math.random() * FALLBACK_IMAGES.length)];
  console.warn('  ⚠ Fallback stock image utilisée');
  return { imageUrl, provider: 'fallback' };
}
