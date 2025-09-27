export const hashPassword = async (password:string,salt:string)=>{
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
        "raw",
        encoder.encode(password),
        {name:"PBKDF2"},
        false,
        ["deriveBits"]
    )

    const derivedBits = await crypto.subtle.deriveBits(
        {
            name:"PBKDF2",
            salt:encoder.encode(salt),
            iterations:10000,
            hash:"SHA-256"
        },
        keyMaterial,
        256
    )

    return btoa(String.fromCharCode(...new Uint8Array(derivedBits)));
}

export const verifyPassword = async (password:string, salt:string, storedHash:string)=>{
    const enteredPassHash = await hashPassword(password,salt)
    return enteredPassHash===storedHash;
}

