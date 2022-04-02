class Encryption {
    #DEFAULT_KEY = '5}B:Ca(+OjRqJ*Ht4x[*x&fxGQ2TE,w$Xt?*v"|OMZ4r}';
    #KEY;

    constructor(key) {
        if (!key) key = this.#DEFAULT_KEY;
        this.#KEY = key;

        this.AES = CryptoJS.AES;
        this.SHA256 = CryptoJS.SHA256;
    }

    encrypt(plainText) {
        if(Array.isArray(plainText) || typeof plainText == 'object')
            plainText = JSON.stringify(plainText);

        const encrypted = CryptoJS.AES.encrypt(plainText, this.#KEY);
        return encrypted.toString();
    }

    decrypt(encryptedText) {
        let decrypted = false;
        try {
            const bytes = CryptoJS.AES.decrypt(encryptedText, this.#KEY);
            decrypted = bytes.toString(CryptoJS.enc.Utf8);
        } catch (error) {
            return false;
        }

        if(!decrypted)
            return false;

        try {
            decrypted = JSON.parse(decrypted);
        } catch (error) {}

        return decrypted;
    }

    static async getInstance(key = null) {
        const enc = new Encryption(key);

        return Promise.resolve(enc);
    }
}