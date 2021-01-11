<script>
    const QUERY = `
        query {
            post(slug: "${QUERYPARAMS["slug"]}") {
                id
                title
                slug
                content {
                    de
                    en
                }
            }
        }
    `;

    const QUERYRES = {};

    const QUERYPARAMOPTS = `
        query {
            posts {
                slug
            }
        }
    `;
</script>

<style>
    main {
        text-align: center;
        margin: 0 auto;
    }
</style>

<svelte:head>
    <title>{QUERYRES.post.title}</title>
</svelte:head>

<main>
    <h1>{QUERYRES.post.title}</h1>
    {@html QUERYRES.post.content.de}
</main>
