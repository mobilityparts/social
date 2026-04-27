const BASE = 'https://graph.facebook.com/v21.0';

function token() {
  return process.env.META_PAGE_ACCESS_TOKEN;
}

async function apiCall(path, params = {}) {
  const url = new URL(`${BASE}${path}`);
  url.searchParams.set('access_token', token());
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }
  const res = await fetch(url.toString());
  const data = await res.json();
  if (data.error) throw new Error(`Meta API: ${data.error.message} (code ${data.error.code})`);
  return data;
}

async function apiPost(path, body = {}) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...body, access_token: token() }),
  });
  const data = await res.json();
  if (data.error) throw new Error(`Meta API: ${data.error.message} (code ${data.error.code})`);
  return data;
}

async function waitForContainer(containerId, maxAttempts = 20) {
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise(r => setTimeout(r, 3000));
    const { status_code } = await apiCall(`/${containerId}`, { fields: 'status_code' });
    if (status_code === 'FINISHED') return;
    if (status_code === 'ERROR' || status_code === 'EXPIRED') {
      throw new Error(`Container Instagram status: ${status_code}`);
    }
  }
  throw new Error('Instagram container timeout');
}

export async function publishToInstagram({ caption, imageUrl }) {
  const igId = process.env.INSTAGRAM_BUSINESS_ID;

  const { id: containerId } = await apiPost(`/${igId}/media`, {
    image_url: imageUrl,
    caption,
  });

  await waitForContainer(containerId);

  const { id } = await apiPost(`/${igId}/media_publish`, {
    creation_id: containerId,
  });

  return { id, platform: 'instagram' };
}

export async function publishToFacebook({ caption, imageUrl }) {
  const pageId = process.env.FACEBOOK_PAGE_ID;

  const { id } = await apiPost(`/${pageId}/photos`, {
    url: imageUrl,
    message: caption,
  });

  return { id, platform: 'facebook' };
}
