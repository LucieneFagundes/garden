export function empty(data: any) {
  switch (data) {
    case "":
    case 0:
    case "0":
    case null:
    case false:
    case undefined:
      return null;
    default:
      return data;
  }
}

export function getBase64Image(file: any) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}