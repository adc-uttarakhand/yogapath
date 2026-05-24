import { SUPABASE_URL, SUPABASE_KEY } from '../constants';

const headers = {
  "Content-Type": "application/json",
  "apikey": SUPABASE_KEY,
  "Authorization": `Bearer ${SUPABASE_KEY}`,
};

// ── Participation (photo/video entries) ───────────────────────────────────────
export async function logParticipation(data) {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/yoga_participation`, {
      method: "POST",
      headers: { ...headers, "Prefer": "return=minimal" },
      body: JSON.stringify(data),
    });
    return res.ok;
  } catch (e) {
    console.error("Supabase insert error:", e);
    return false;
  }
}

export async function fetchParticipation() {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/yoga_participation?select=*&order=created_at.desc&limit=100`,
      { headers }
    );
    if (res.ok) return await res.json();
  } catch (e) {
    console.error("Supabase fetch error:", e);
  }
  return [];
}

// ── Challenge / Streak ────────────────────────────────────────────────────────
export async function saveChallenge(userKey, name, district, data) {
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/yoga_challenge`, {
      method: "POST",
      headers: { ...headers, "Prefer": "resolution=merge-duplicates" },
      body: JSON.stringify({
        user_key: userKey,
        name, district,
        challenge_days: data.days,
        completed_days: data.done,
        badges: data.badges,
        last_checkin: data.lastCheckin,
        cert_generated: data.certGenerated || false,
      }),
    });
  } catch (e) {
    console.error("Challenge save error:", e);
  }
}
