export async function fileDataToSave(file: File) {
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    return uint8Array
}



