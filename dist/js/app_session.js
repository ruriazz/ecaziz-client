class Session {
    static async getInstance() {
        const session = new Session();
        const encryption = await Encryption.getInstance('M,=+g6%c~uPtLn;*y^KY>~W6;[tA2z');
        const storage = await Storage.getInstance('app_sessions');

        session.set = async function(keyName, value) {
            value = encryption.encrypt(value);

            try {
                let insert = await storage.insert(keyName, value);
                return Promise.resolve(insert);
            } catch (error) {
                return Promise.resolve(false);
            }
        };

        session.get = async function(keyName) {
            try {
                let value = await storage.get(keyName);
                value = encryption.decrypt(value);
                
                return Promise.resolve(value);
            } catch (error) {
                return Promise.resolve(null);
            }
        };
        
        session.unset = async function(keyname) {
            try {
                const remove = await storage.delete(keyname);

                return Promise.resolve(remove);
            } catch (error) {
                return Promise.resolve(false);
            }
        };

        return Promise.resolve(session);
    }
}