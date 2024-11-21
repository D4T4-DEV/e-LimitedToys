import Cookies from "js-cookie";

// Funciones para cifrar y descifrar
export async function encryptSessionIndicator(value: string): Promise<string> {
    const encoder = new TextEncoder();
    const key = await getOrGenerateKey();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encodedValue = encoder.encode(value);

    const encrypted = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        key,
        encodedValue
    );

    const encryptedContent = new Uint8Array(encrypted);
    return btoa(String.fromCharCode(...iv) + String.fromCharCode(...encryptedContent));
}

export async function decryptSessionIndicator(value: string): Promise<string> {
    const key = await getOrGenerateKey();
    const data = atob(value);

    const iv = new Uint8Array(data.slice(0, 12).split("").map((c) => c.charCodeAt(0)));
    const encryptedContent = new Uint8Array(
        data.slice(12).split("").map((c) => c.charCodeAt(0))
    );

    const decrypted = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv },
        key,
        encryptedContent
    );

    return new TextDecoder().decode(decrypted);
}

// Generar clave segura o cargarla de sessionStorage
async function getOrGenerateKey(): Promise<CryptoKey> {
    try {
        const storedKey = Cookies.get("sessionKey");
        if (storedKey) {
            const rawKey = Uint8Array.from(atob(storedKey), (c) => c.charCodeAt(0));
            return crypto.subtle.importKey("raw", rawKey, { name: "AES-GCM" }, true, [
                "encrypt",
                "decrypt",
            ]);
        }

        // Genera una nueva clave si no existe
        const key = await crypto.subtle.generateKey(
            { name: "AES-GCM", length: 256 },
            true,
            ["encrypt", "decrypt"]
        );

        const exportedKey = await crypto.subtle.exportKey("raw", key);
        // define el tiempo en una hora (usado para expiración)
        const expires = new Date(new Date().getTime() + 60 * 60 * 1000); 
        Cookies.set("sessionKey", btoa(String.fromCharCode(...new Uint8Array(exportedKey))), {
            expires: expires,
            secure: true, // Solo disponible en HTTPS
            sameSite: "Strict", // Evita el uso en solicitudes de terceros
        });

        return key;
    } catch (error) {
        console.error("Failed to get or generate encryption key:", error);
        throw new Error("Key generation or retrieval failed");
    }
}