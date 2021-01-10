<script>
    const QUERY = `
        query {
            post(id: "6ada4a19-14b0-4eff-ba84-26b3d4cfd2eb") {
                id
                data {
                    title
                    content
                }
            }
        }
    `;

    const QUERYRES = {};

    const QUERYPARAMOPTS = `
        query {
            posts {
                id
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
    <title>{QUERYRES.post.data.title}</title>
</svelte:head>

<main>
    <h1>{QUERYRES.post.data.title}</h1>
    {@html QUERYRES.post.data.content}
</main>
