export const decode = (message) => {
  const decoder = new TextDecoder('utf-8');
  return JSON.parse(decoder.decode(message));
}
export  const encode = (message) => {
  const encoder = new TextEncoder();
  return encoder.encode(JSON.stringify(message));
}