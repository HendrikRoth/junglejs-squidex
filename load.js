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

function getContent(access_token, base_url, app, schema) {
    return axios.request({
        url: `/api/content/${app}/${schema}`,
        baseURL: base_url,
        method: "GET",
        headers: {Authorization: `Bearer ${access_token}`}
    })
    .then(response => response.data.items
        .map(normalize)
    //    .map(r => loadAssets(base_url, app, r))
    );
}

function normalize(item) {
    Object.keys(item.data).map(key => {
        if (item.data[key].iv)
            item.data[key] = item.data[key].iv;
    });
    delete item._links;
    return item;
}

/*
 * TODO
function loadAssets(base_url, app, response) {
    console.log(response);
    if (!response.data) return response;

    Object.entries(response.data).map(x => {
        if (x[1].iv && x[1].iv.fileSize > 0) {
            x[1].iv = x[1].iv.map(x => {
                const path = "/static/assets/";

                if (!fs.existsSync(__dirname + path + x)) {
                    // file does not exist. download it.
                    // TODO: thumbnails?
                    const source = `${base_url}/api/assets/${app}/${x}`;

                    axios
                        .get(source, {responseType: "blob"})
                        .then(fileBlob => {
                            fs.writeFile(__dirname + path + x, fileBlob.data, (err) => {
                                if (err) {
                                    throw new Error(err);
                                }
                            });
                        });
                }

                return path + x;
            });
        }
    });

    return response;
}
*/

module.exports = async ({client_id, client_secret, base_url}) => {
    const access_token = await getToken(client_id, client_secret, base_url);
    const app = client_id.split(":")[0];
    return schema => getContent(access_token, base_url, app, schema);
};
