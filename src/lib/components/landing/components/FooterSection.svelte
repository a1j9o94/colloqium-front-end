<script lang="ts">

export let title = 'Section Header';

export let links: { text: string; href: string }[] = [];

</script>

<div class="flex-1">
    <p class="uppercase text-gray-500 md:mb-6">{title}</p>
    <ul class="list-reset mb-6">
        
        {#each links as link}
            <li class="mt-2 inline-block mr-2 md:block md:mr-0">
                <!-- svelte-ignore a11y-invalid-attribute -->
                <a href={link.href} class="no-underline hover:underline text-gray-800 hover:text-pink-500"
                    >{link.text}</a
                >
            </li>
        {/each}
    </ul>
</div>