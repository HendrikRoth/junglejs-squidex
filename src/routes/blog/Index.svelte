<script>
    const QUERY = `
        query {
            posts {
                slug
                title
                id
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
            <h3>{post.title}</h3>
            <a href="/blog/{post.id}">{post.title}</a>
        </article>
    {/each}
</main>
