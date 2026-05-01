export async function uploadImage(buffer) {
  const key = process.env.IMGBB_API_KEY;
  if (!key) throw new Error('IMGBB_API_KEY secret manquant');

  const base64 = buffer.toString('base64');
  const form = new URLSearchParams();
  form.append('image', base64);

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, {
    method: 'POST',
    body: form,
  });

  if (!res.ok) throw new Error(`imgbb upload failed: ${res.status} ${await res.text()}`);

  const data = await res.json();
  if (!data.success) throw new Error(`imgbb error: ${JSON.stringify(data.error)}`);

  return data.data.url;
}
