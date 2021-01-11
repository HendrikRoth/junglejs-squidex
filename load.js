const axios = require("axios");
const fs = require("fs");

function getToken(client_id, client_secret, base_url) {
    return axios.request({
        url: "/identity-server/connect/token",
        baseURL: base_url,
        method: "POST",
        data: `client_id=${client_id}&client_secret=${client_secret}&scope=squidex-api&grant_type=client_credentials`,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    })
    .then(response => response.data.access_token);
}

async function getContent(access_token, base_url, app, schema, options = {}) {
    try {
        const response = await axios.request({
            url: `/api/content/${app}/${schema}`,
            baseURL: base_url,
            method: "GET",
            headers: {Authorization: `Bearer ${access_token}`}
        });

        const items = Promise.all(
            response.data.items
                .map(normalize)
                .map(item => loadAssets(base_url, app, item, options))
            );

        return items;
    }
    catch (err) {
        throw new Error(err);
    }
}

function normalize(item) {
    const n = { id: item.id };

    Object.keys(item.data).map(key => {
        if (item.data[key].iv)
            n[key] = item.data[key].iv;
        else
            n[key] = item.data[key];
    });

    n.meta = item;

    delete n.meta.id;
    delete n.meta.data;
    delete n.meta._links

    return n;
}

async function download(base_url, app, x) {
    const path = "/assets/";
    const filename = path + x + ".png";
    const fullpath = __dirname + "/static" + filename;

    if (!fs.existsSync(fullpath)) {
        const source = `${base_url}/api/assets/${app}/${x}?format=png&width=800`;

        const resp = await axios({
            method: "GET",
            url: source,
            responseType: "stream"
        });

        await resp.data.pipe(fs.createWriteStream(fullpath));
    }

    return filename;
}

async function loadAssets(base_url, app, response, options) {
    if (options && options.assets && Array.isArray(options.assets)) {
        for await (asset of options.assets) {
            if (response[asset]) {
                const assets = [];
                for await (a of response[asset]) {
                    assets.push(await download(base_url, app, a));
                }
                response[asset] = assets;
            }
        }
    }
    return response;
}

module.exports = async ({client_id, client_secret, base_url}) => {
    const access_token = await getToken(client_id, client_secret, base_url);
    const app = client_id.split(":")[0];
    return async (schema, options = {}) => await getContent(access_token, base_url, app, schema, options);
};
