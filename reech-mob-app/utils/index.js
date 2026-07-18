export function getCurrentEpoch() {
  return Math.round(Date.now() / 1000);
}

export async function getBase64FromUri(uri) {
  const response = await fetch(uri);
  const blob = await response.blob();
  const reader = new FileReader();
  reader.readAsDataURL(blob);
  return new Promise((resolve) => {
    reader.onloadend = () => {
      resolve(reader.result);
    };
  });
}
