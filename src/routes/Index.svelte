<script>
    const QUERY = `
        query {
            settings {
                title {
                    de
                    en
                }
            }

            posts {
                id
                title
                content {
                    de
                    en
                }
                image
            }
        }
    `;

    const QUERYRES = {};
</script>


<svelte:head>
    <title>Index</title>
</svelte:head>

<main>{QUERYRES.settings[0].title.de}</main>
<ul>
    {#each QUERYRES.posts as post}
        <article>
            <h1>{post.title}</h1>
            {@html post.content.en}
            <img src="{post.image[0]}" />
        </article>
    {/each}
</ul>

<style>
    main {
        text-align: center;
        margin: 0 auto;
    }
</style>
