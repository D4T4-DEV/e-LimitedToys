type JsonData = { [key: string]: any }; // -> Objeto JSON 


// Clave publica
const { VITE_PUBLIC_KEY } = import.meta.env;

// Convierte una clave pública PEM a ArrayBuffer
function pemToArrayBuffer(pem: string): ArrayBuffer {
    // Eliminar encabezados y pie de página, luego decodificar Base64
    const b64 = pem
        .replace(/-----(BEGIN|END) PUBLIC KEY-----/g, "")
        .replace(/\s+/g, "");
    const binaryDer = atob(b64);
    const binaryDerBuffer = new Uint8Array(binaryDer.length);
    for (let i = 0; i < binaryDer.length; i++) {
        binaryDerBuffer[i] = binaryDer.charCodeAt(i);
    }
    return binaryDerBuffer.buffer;
}

// Importar la clave pública
async function importPublicKey(pem: string): Promise<CryptoKey> {
    const binaryDer = pemToArrayBuffer(pem);
    return await crypto.subtle.importKey(
        "spki", // Formato de clave pública
        binaryDer,
        {
            name: "RSA-OAEP",
            hash: "SHA-256",
        },
        true,
        ["encrypt"]
    );
}

// Funcion de cifrado de los datos que vienen como JSON
export async function EncriptarDatos(data: JsonData): Promise<string> {

    if (!VITE_PUBLIC_KEY) {
        throw new Error('La clave AES_PRIVATE_KEY no está definida o está vacía');
    }

    const key = await importPublicKey(VITE_PUBLIC_KEY);
    const encoded = new TextEncoder().encode(JSON.stringify(data));

    const encrypted = await crypto.subtle.encrypt(
        {
            name: "RSA-OAEP",
        },
        key,
        encoded
    );

    // Convertir el ArrayBuffer cifrado a Base64 para transmitirlo
    return btoa(String.fromCharCode(...new Uint8Array(encrypted)));
}