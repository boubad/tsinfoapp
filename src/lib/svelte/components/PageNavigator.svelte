<script lang="ts">
  import {
    Col,
    Pagination,
    PaginationItem,
    PaginationLink,
    Row,
  } from "sveltestrap";
  import InputNumber from "./InputNumber.svelte";
  //
  const _DISPLAY_PAGES = 5;
  //
  export let page: number = 1;
  export let pagesCount: number = 0;
  export let pages: number[] = [];
  export let lpath: string = "#";
  export let pagesize: number = 8;
  export let itemsCount: number = 0;
  export let onGotoPage: (p: number) => void = (_p: number) => {};
  export let onPageSizeChanged: (p: number) => void = (_p: number) => {};
  //
  const onNavigate = (n: number) => {
    if (n > 0 && page !== n) {
      onGotoPage(n);
    }
  };
  //
  const onValueChanged = (val: unknown, _name: string): void => {
    const n = val as number;
    if (n && n > 0 && n !== pagesize) {
      pagesize = n;
      if (itemsCount > 0) {
        let oldpage = page;
        if (oldpage < 1) {
          oldpage = 1;
        }
        let np = Math.floor(itemsCount / n);
        if (itemsCount % n !== 0) {
          np = np + 1;
        }
        pagesCount = np;
        if (oldpage > np) {
          oldpage = np;
        }
        let startPage = Math.floor(oldpage - _DISPLAY_PAGES / 2);
        if (startPage < 1) {
          startPage = 1;
        }
        let lastPage = startPage + _DISPLAY_PAGES - 1;
        if (lastPage > np) {
          lastPage = np;
        }
        const xpages: number[] = [];
        for (let i = startPage; i <= lastPage; i++) {
          xpages.push(i);
        }
        pages = [...xpages];
        if (page < startPage) {
          page = startPage;
        }
        if (page > lastPage) {
          page = lastPage;
        }
      } // itemsCount
      onPageSizeChanged(n);
    }
  };
  //
</script>

<div>
  {#if pagesCount > 1}
    <Row class="align-middle">
      <Col>
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
                <strong>{p}</strong>
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
      <Col xs="2">
        <InputNumber
          name={"pagenavigator"}
          label={"Nb./page"}
          value={pagesize}
          {onValueChanged}
        />
      </Col>
      <Col xs="3">
        <strong>
          {"Page " + page} / {pagesCount + " pages"}
        </strong></Col
      >
    </Row>
  {/if}
</div>
