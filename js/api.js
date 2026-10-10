import { getToken, getUserId } from './storage.js';

const API_VERSION = 'v25.0';

async function graphGet(path, params = {}) {
  const token = getToken();
  if (!token) throw new Error('No hay un token configurado');

  const res = await fetch('/api/proxy', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({apiPath:`/${API_VERSION}${path}`,params,token})});
  const data = await res.json();

  if (data.error) {
    throw new Error(data.error.message || 'Error en la API de Instagram');
  }
  return data;
}

export async function validateToken(token) {
  const res = await fetch('/api/proxy',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({apiPath:`/${API_VERSION}/me`,params:{fields:'user_id,username,name,account_type,profile_picture_url,followers_count'},token})});
  const data = await res.json();

  if (data.error) {
    throw new Error(data.error.message || 'Error en la API de Instagram');
  }

  if (!data.user_id) {
    throw new Error('Token no válido o sin permisos. Revisa que: (1) tu cuenta de Instagram sea profesional (empresa o creador), (2) el token tenga el permiso instagram_business_basic.');
  }

  return {
    userId: data.user_id,
    username: data.username,
    profilePicture: data.profile_picture_url,
    followersCount: data.followers_count,
  };
}

export async function fetchAccountInfo() {
  const userId = getUserId();
  return graphGet(`/${userId}`, {
    fields: 'followers_count,media_count,username,name,profile_picture_url',
  });
}

export async function fetchAccountInsights(since, until) {
  const userId = getUserId();
  return graphGet(`/${userId}/insights`, {
    metric: 'reach,views,total_interactions,accounts_engaged,follows_and_unfollows,profile_links_taps',
    period: 'day',
    metric_type: 'total_value',
    since,
    until,
  });
}

export async function fetchFollowsBreakdown(since, until) {
  const userId = getUserId();
  return graphGet(`/${userId}/insights`, {
    metric: 'follows_and_unfollows',
    period: 'day',
    metric_type: 'total_value',
    breakdown: 'follow_type',
    since,
    until,
  });
}

export async function fetchNetFollows(since, until) {
  const userId = getUserId();
  return graphGet(`/${userId}/insights`, {
    metric: 'follows_and_unfollows',
    period: 'day',
    metric_type: 'total_value',
    since,
    until,
  });
}

export async function fetchDemographics(breakdownType) {
  const userId = getUserId();
  return graphGet(`/${userId}/insights`, {
    metric: 'follower_demographics',
    period: 'lifetime',
    breakdown: breakdownType,
    metric_type: 'total_value',
  });
}

export async function fetchMedia(limit = 50) {
  const userId = getUserId();
  return graphGet(`/${userId}/media`, {
    fields: 'id,caption,media_type,media_product_type,timestamp,like_count,comments_count,permalink,thumbnail_url,media_url',
    limit,
  });
}

export async function fetchMediaInsights(mediaId) {
  return graphGet(`/${mediaId}/insights`, {
    metric: 'reach,saved,shares,total_interactions,views',
  });
}

export async function fetchStories() {
  const userId = getUserId();
  return graphGet(`/${userId}/stories`, {
    fields: 'id,timestamp,media_type,permalink',
  });
}

export async function fetchStoryInsights(storyId) {
  return graphGet(`/${storyId}/insights`, {
    metric: 'reach,replies,shares,views',
  });
}
