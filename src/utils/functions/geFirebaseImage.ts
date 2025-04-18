export const getFirebaseImage = (folder: string, fileName: string) => {
  return `https://firebasestorage.googleapis.com/v0/b/freelancer-159f4.appspot.com/o/${folder}%2F${fileName}?alt=media`;
};
