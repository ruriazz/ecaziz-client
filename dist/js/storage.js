class Storage {
    static async getInstance(instanceName) {
        const storage = new Storage(instanceName);
        const encryption = await Encryption.getInstance('_;D}_a0j.R(C96nPJFfn6(c_UH=nnE');

        localforage.config({
            driver      : localforage.LOCALSTORAGE,
            name        : 'ecaziz#manager',
            version     : 1.0,
        });

        const instance = localforage.createInstance({
            name: instanceName
        });

        storage.get = async function(keyName) {
            try {
                let value = await instance.getItem(keyName);
                value = encryption.decrypt(value);
                
                return Promise.resolve(value);
            } catch (error) {
                return Promise.resolve(null);
            }
        }

        storage.insert = async function(keyName, value) {
            value = encryption.encrypt(value);

            try {
                let insert = await instance.setItem(keyName, value);
                if(insert == value)
                    return Promise.resolve(true);
            } catch (error) {
                return Promise.resolve(false);
            }
        }

        storage.update = async function(keyName, newValue) {
            const exists = await this.get(keyName);
            if(!exists)
                return Promise.resolve(false);

            const updated = await this.insert(keyName, newValue);

            Promise.resolve(updated);
        }

        storage.delete = async function(keyName) {
            const exists = await this.get(keyName);
            if(!exists)
                return Promise.resolve(false);

            try {
                const remove = await instance.removeItem(keyName);
                return Promise.resolve(remove);
            } catch (error) {
                return Promise.resolve(false);
            }
        }
        
        return Promise.resolve(storage);
    }
}