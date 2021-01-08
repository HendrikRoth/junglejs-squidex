<script>
    const QUERY = `
        query {
            posts {
                id
                data {
                    title
                    content
                }
            }
        }
    `;

    const QUERYRES = {};
</script>

<style>
    main {
        text-align: center;
        margin: 0 auto;
    }
</style>

<svelte:head>
    <title>Blog</title>
</svelte:head>

<main>
    <h1>Recent posts</h1>

    {#each QUERYRES.posts as post}
        <article>
            <h3>{{post.data.title}}</h3>
            <a href="/blog/{post.id}">{post.data.title}</a>
        </article>
    {/each}
</main>
