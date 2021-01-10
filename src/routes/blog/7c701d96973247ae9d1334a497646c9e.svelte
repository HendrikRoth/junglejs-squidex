<script>
    const QUERY = `
        query {
            post(id: "7c701d96-9732-47ae-9d13-34a497646c9e") {
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
