const svelte = require('rollup-plugin-svelte');
const { terser } = require('rollup-plugin-terser');
const resolve = require('@rollup/plugin-node-resolve').default;
const commonjs = require('@rollup/plugin-commonjs');
const ssr = require('rollup-plugin-svelte-ssr');

const { junglePreprocess } = require('junglejs');
const fs = require('fs');
const load = require("./load");

const production = !!process.env.PRODUCTION;

const templateHtml = fs.readFileSync('src/template.html', { encoding: 'utf8', flag: 'r' });

module.exports = async (args) => {
    if (args.length < 3) throw new Error("Missing client_id, client_secret and base_url");
    const itemLoader = await load({ client_id: args[0], client_secret: args[1], base_url: args[2] });

    return {
        clientInputOptions: (filename, extension) => {
            return {
                input: `jungle/build${extension}/${filename}/main.js`,
                plugins: [
                    svelte({
                        dev: !production,
                        hydratable: true,
                        preprocess: [
                            junglePreprocess,
                        ],
                    }),

                    resolve({
                        browser: true,
                        dedupe: ["svelte"],
                    }),
                    commonjs(),

                    production && terser(),
                ],
            }
        },
        clientOutputOptions: (filename, extension) => {
            return {
                sourcemap: /*!production ? 'inline' : */false,
                format: 'iife',
                name: "app",
                file: `jungle/build${extension}/${filename}/bundle.js`,
            };
        },
        ssrInputOptions: (filename, extension) => {
            const processedFilename = filename == "." ? "Index" : filename.split("-").map(s => s.charAt(0).toUpperCase() + s.slice(1)).join("");

            return {
                input: `src/routes${extension}/${processedFilename}.svelte`,
                plugins: [
                    svelte({
                        dev: !production,
                        preprocess: [
                            junglePreprocess,
                        ],
                        generate: "ssr",
                        hydratable: true,
                        css: (css) => {
                            css.write(`jungle/build${extension}/${filename}/bundle.css`);
                        },
                    }),

                    resolve({
                        browser: true,
                        dedupe: ["svelte"],
                    }),
                    commonjs(),

                    production && terser(),

                    ssr({
                        fileName: 'index.html',
                        configureExport: function (html, css) {
                            return templateHtml.replace('{jungle.export.html}', html);
                        },
                    }),
                ],
            }
        },
        ssrOutputOptions: (filename, extension) => {
            return {
                sourcemap: !production ? 'inline' : false,
                format: 'cjs',
                file: `jungle/build${extension}/${filename}/ssr.js`,
            }
        },
        dataSources: [
            // name singular!
            { format: "json", name: "post", items: await itemLoader("post"), queryArgs: { id: "String!" } }
        ]
    }
};
