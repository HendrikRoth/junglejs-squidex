const express = require("express");
const {startGraphqlServer, stopGraphqlServer, startAppServer, readRoutes} = require("junglejs");
const getJungleConfig = require("./jungle.config");
const app = express();
const args = process.argv.slice(2);

getJungleConfig(args)
    .then(jungleConfig => {
        console.log(JSON.stringify(jungleConfig, null, 4));

        startGraphqlServer(jungleConfig, __dirname,
            () => readRoutes(jungleConfig, app, __dirname)
                    .then(() => stopGraphqlServer(
                        () => startAppServer(app)
                    ))
        );
    });

