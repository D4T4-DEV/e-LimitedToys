
type JsonData = { [key: string]: any }; // -> Objeto JSON 
type EncryptedData = string; // -> Datos en string 

const { AES_PRIVATE_KEY } = import.meta.env;

async function getCryptoKey(): Promise<CryptoKey> {
    if (!AES_PRIVATE_KEY) {
        throw new Error('La clave AES_PRIVATE_KEY no está definida o está vacía');
    }

    try {
        // Decodifica la clave desde Base64 y conviértela a un Uint8Array para Web Crypto API
        const keyBuffer = Uint8Array.from(atob(AES_PRIVATE_KEY), c => c.charCodeAt(0));
        return await crypto.subtle.importKey(
            'raw',
            keyBuffer,
            { name: 'AES-GCM' },
            false,
            ['encrypt', 'decrypt']
        );
    } catch (error) {
        throw new Error('La clave AES_PRIVATE_KEY no está en formato Base64 o es inválida');
    }
}

export async function EncriptarDatos(JSON_DATA: JsonData): Promise<EncryptedData> {
    const TXT_DATA = JSON.stringify(JSON_DATA);
    const key = await getCryptoKey();

    // Genera un IV aleatorio de 16 bytes (128 bits) para AES-GCM
    const iv = crypto.getRandomValues(new Uint8Array(16));

    // Encripta el texto
    const encrypted = await crypto.subtle.encrypt(
        {
            name: 'AES-GCM',
            iv: iv
        },
        key,
        new TextEncoder().encode(TXT_DATA)
    );

    const authTag = encrypted.slice(encrypted.byteLength - 16); // Últimos 16 bytes como AuthTag
    const ciphertext = encrypted.slice(0, encrypted.byteLength - 16);

    // Convierte IV, AuthTag y el texto encriptado a hexadecimal
    return `${arrayBufferToHex(iv)}:${arrayBufferToHex(authTag)}:${arrayBufferToHex(ciphertext)}`;
}

// Nueva función para desencriptar datos en el cliente
export async function DesencriptarDatos(STRING_DATA: EncryptedData): Promise<JsonData> {
    const [ivHex, authTagHex, encryptedHex] = STRING_DATA.split(':');
    const key = await getCryptoKey();

    // Convierte IV, AuthTag y texto encriptado de hexadecimal a ArrayBuffer
    const iv = hexToArrayBuffer(ivHex);
    const authTag = hexToArrayBuffer(authTagHex);
    const encrypted = hexToArrayBuffer(encryptedHex);

    // Combina el texto encriptado y la etiqueta de autenticación en un solo ArrayBuffer
    const encryptedWithAuthTag = new Uint8Array(encrypted.byteLength + authTag.byteLength);
    encryptedWithAuthTag.set(new Uint8Array(encrypted), 0);
    encryptedWithAuthTag.set(new Uint8Array(authTag), encrypted.byteLength);

    // Desencripta el texto encriptado
    const decrypted = await crypto.subtle.decrypt(
        {
            name: 'AES-GCM',
            iv: iv
        },
        key,
        encryptedWithAuthTag
    );

    // Convierte el texto desencriptado a JSON
    return JSON.parse(new TextDecoder().decode(decrypted));
}

// Utilidades para convertir entre ArrayBuffer y hexadecimal
function arrayBufferToHex(buffer: ArrayBuffer): string {
    return Array.from(new Uint8Array(buffer))
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join('');
}

function hexToArrayBuffer(hex: string): ArrayBuffer {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
        bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16);
    }
    return bytes.buffer;
}
