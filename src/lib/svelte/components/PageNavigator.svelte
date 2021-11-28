<script lang="ts">
  import {
    Col,
    Pagination,
    PaginationItem,
    PaginationLink,
    Row,
  } from "sveltestrap";
  //
  export let busy: boolean = false;
  export let page: number = 1;
  export let pagesCount: number = 0;
  export let pages: number[] = [];
  export let lpath: string = "#";
  export let onGotoPage: (p: number) => void = (_p: number) => {};
  //
  $: canDisplay = pagesCount > 1;
  $: canPrev = page > 1;
  $: canNext = page < pagesCount;
  $: currentPath = "#" + lpath;
  //
  const onNavigate = (n: number) => {
    if (n > 0 && page !== n) {
      onGotoPage(n);
    }
  };
  //
</script>

{#if canDisplay && !busy}
  <div>
    <Row class="text-center">
      <Col class="text-center">
        <Pagination>
          <PaginationItem disabled={!canPrev}>
            <PaginationLink
              first
              href={currentPath}
              on:click={() => {
                onNavigate(1);
              }}
            />
          </PaginationItem>
          <PaginationItem disabled={!canPrev}>
            <PaginationLink
              previous
              href={currentPath}
              on:click={() => {
                onNavigate(page - 1);
              }}
            />
          </PaginationItem>
          {#each pages as p (p)}
            <PaginationItem active={p === page}>
              <PaginationLink
                href={currentPath}
                on:click={() => {
                  onNavigate(p);
                }}
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          {/each}
          <PaginationItem disabled={!canNext}>
            <PaginationLink
              next
              href={currentPath}
              on:click={() => {
                onNavigate(page + 1);
              }}
            />
          </PaginationItem>
          <PaginationItem disabled={!canNext}>
            <PaginationLink
              last
              href={currentPath}
              on:click={() => {
                onNavigate(pagesCount);
              }}
            />
          </PaginationItem>
        </Pagination>
      </Col>
      <Col
        ><strong class="">
          {"Page " + page} / {pagesCount + " pages"}
        </strong></Col
      >
    </Row>
  </div>
{/if}
