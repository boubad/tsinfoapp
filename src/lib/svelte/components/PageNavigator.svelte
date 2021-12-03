<script lang="ts">
  import {
    Col,
    Pagination,
    PaginationItem,
    PaginationLink,
    Row,
  } from "sveltestrap";
  //
  export let page: number = 1;
  export let pagesCount: number = 0;
  export let pages: number[] = [];
  export let lpath: string = "#";
  export let onGotoPage: (p: number) => void = (_p: number) => {};
  //
  const onNavigate = (n: number) => {
    if (n > 0 && page !== n) {
      onGotoPage(n);
    }
  };
  //
</script>

<div>
  {#if pagesCount > 1}
    <Row class="text-center">
      <Col class="text-center">
        <Pagination>
          <PaginationItem disabled={page <= 1}>
            <PaginationLink
              first
              href={"#" + lpath}
              on:click={() => {
                onNavigate(1);
              }}
            />
          </PaginationItem>
          <PaginationItem disabled={page <= 1}>
            <PaginationLink
              previous
              href={"#" + lpath}
              on:click={() => {
                onNavigate(page - 1);
              }}
            />
          </PaginationItem>
          {#each pages as p (p)}
            <PaginationItem active={p === page}>
              <PaginationLink
                href={"#" + lpath}
                on:click={() => {
                  onNavigate(p);
                }}
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          {/each}
          <PaginationItem disabled={page >= pagesCount}>
            <PaginationLink
              next
              href={"#" + lpath}
              on:click={() => {
                onNavigate(page + 1);
              }}
            />
          </PaginationItem>
          <PaginationItem disabled={page >= pagesCount}>
            <PaginationLink
              last
              href={"#" + lpath}
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
  {/if}
</div>
