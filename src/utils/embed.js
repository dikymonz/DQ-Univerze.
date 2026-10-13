export function getEmbedUrl(url) {
  if (!url) return null;

  // Handling Link YouTube (Standard, Shorts, & Mobile)
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    let videoId = '';
    if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0];
    } else if (url.includes('youtube.com/shorts/')) {
      videoId = url.split('youtube.com/shorts/')[1]?.split('?')[0];
    } else if (url.includes('v=')) {
      videoId = url.split('v=')[1]?.split('&')[0];
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  }

  // Handling Link TikTok Player
  if (url.includes('tiktok.com')) {
    const videoId = url.split('/video/')[1]?.split('?')[0];
    return videoId ? `https://www.tiktok.com/player/v1/${videoId}?music_info=1&description=1` : null;
  }

  return null;
}