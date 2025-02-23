export const getVideoPath = (filename: string) => {
  const isProd = process.env.NODE_ENV === "production";
  if (isProd) {
    return `/_next/static/media/${filename}`;
  }
  return `/videos/${filename}`;
};
