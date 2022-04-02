class APIClient {
    #BASEURL = 'https://api.ecaaziz.link';
    #METHOD = ['GET', 'POST', 'PUT', 'PATCH', 'OPTIONS', 'DELETE']

    static async getInstance() {
        const client = new APIClient();
        const session = await Session.getInstance();
        const config = {
            baseURL: client.#BASEURL,
            timeout: 10000,
            validateStatus: function (status) {
                return status >= 200 && status < 500;
            },
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            },
            responseType: 'json',
            responseEncoding: 'utf8'
        };

        client.fetch = async function ({ method, path, data = {}, headers = {}, success, error } = {}) {
            method = method.toUpperCase();

            const tokenSaved = await session.get('auth_data');
            if(tokenSaved !== null)
                config.headers['Authorization'] = `Bearer ${tokenSaved}`;

            if (!client.#METHOD.includes(method))
                throw `Request method is only ${JSON.stringify(client.#METHOD)}`;

            config.method = method;
            config.url = path;
            if (data) {
                if (method == 'GET') {
                    let params = '?';
                    for (const key in data) {
                        if (params.charAt(params.length - 1) != ('?' || '&'))
                            params += '&';

                        params += `${key}=${data[key]}`;
                    }

                    config.url += params.length > 1 ? params : '';
                } else if (method == ('POST' || 'PUT' || 'PATCH')) {
                    config.headers['Content-Type'] = 'application/json';
                    config.data = data;
                }
            }

            for(const key in headers) {
                config.headers[key] = headers[key];
            }

            let response = undefined;
            try {
                response = await axios(config);
            } catch (error) {
                return Promise.resolve(false);
            }

            if(typeof response == undefined)
                return Promise.resolve(false);

            let result = response.data;

            if (response.status < 400) {
                if(typeof response.headers['auth-token'] === 'string') {
                    const authToken = response.headers['auth-token'];
                    await session.set('auth_data', authToken);
                }

                result.headers = response.headers;
                if (typeof success == 'function')
                    return Promise.resolve(success(result));
            } else {
                if (typeof error == 'function')
                    return Promise.resolve(error(result))
            }

            return Promise.resolve(result);
        };

        return Promise.resolve(client);
    }
}