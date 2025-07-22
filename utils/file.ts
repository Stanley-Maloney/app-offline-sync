import * as FileSystem from 'expo-file-system';

const IMAGES_DIR = FileSystem.documentDirectory + 'images';

export const saveImage = async (id: string | number, source: string) => {
  await FileSystem.makeDirectoryAsync(IMAGES_DIR, { intermediates: true });
  const fileUri = `${IMAGES_DIR}/${id}.jpg`;
  try {
    if (source.startsWith('data:')) {
      const base64 = source.split(',')[1];
      await FileSystem.writeAsStringAsync(fileUri, base64, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return fileUri;
    }

    const result = await FileSystem.downloadAsync(source, fileUri);
    return result.uri;
  } catch {
    return null;
  }
};
