<script lang="ts">
  import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
  } from "sveltestrap";
  import environment from "./environment";
  import {
    TITLE_ANNEES,
    TITLE_CONTROLES,
    TITLE_ETUDAFFECTATIONS_LIST,
    TITLE_ETUDIANTS,
    TITLE_FILTERETUDIANTS,
    TITLE_GROUPES,
    TITLE_GROUPESCONTROLES,
    TITLE_MATIERES,
    TITLE_MENU,
    TITLE_SEMESTRES,
    TITLE_UNITES,
  } from "./lib/svelte/InfoPrompt";
  import {
    currentanneestore,
    currentgroupestore,
    currentmatierestore,
    currentsemestrestore,
    currentunitestore,
  } from "./lib/svelte/stores/globalstores";
  import { InfoRouter } from "./routes/InfoRouter";
  import {
    ROUTE_ANNEES_LIST,
    ROUTE_CONTROLES_LIST,
    ROUTE_ETUDAFFECTATIONS_LIST,
    ROUTE_ETUDIANTS_LIST,
    ROUTE_FILTER_ETUDIANT,
    ROUTE_GROUPECONTROLES_LIST,
    ROUTE_GROUPES_LIST,
    ROUTE_MATIERES_LIST,
    ROUTE_SEMESTRES_LIST,
    ROUTE_TEST,
    ROUTE_UNITES_LIST,
  } from "./routes/routesdefs";

  let isOpen = false;
  //
  function handleUpdate(event: any) {
    isOpen = event.detail.isOpen;
  }
  $: semestreid = $currentsemestrestore;
  $: uniteid = $currentunitestore;
  $: matiereid = $currentmatierestore;
  $: anneeid = $currentanneestore;
  $: groupeid = $currentgroupestore;
  //
</script>

<Navbar color="light" light expand="md">
  <NavbarBrand href="/">{environment.appName}</NavbarBrand>
  <NavbarToggler on:click={() => (isOpen = !isOpen)} />
  <Collapse {isOpen} navbar expand="md" on:update={handleUpdate}>
    <Nav class="ms-auto" navbar>
      <NavItem>
        <NavLink href={ROUTE_TEST}>{"Test"}</NavLink>
      </NavItem>
      <NavItem
        disabled={anneeid.length < 1 ||
          groupeid.length < 1 ||
          semestreid.length < 1 ||
          matiereid.length < 1}
      >
        <NavLink
          href={ROUTE_CONTROLES_LIST +
            "/" +
            anneeid +
            "/" +
            groupeid +
            "/" +
            semestreid +
            "/" +
            matiereid}>{TITLE_CONTROLES}</NavLink
        >
      </NavItem>
      <NavItem>
        <NavLink href={ROUTE_ETUDIANTS_LIST}>{TITLE_ETUDIANTS}</NavLink>
      </NavItem>
      <Dropdown nav inNavbar>
        <DropdownToggle nav caret>{TITLE_MENU}</DropdownToggle>
        <DropdownMenu end>
          <DropdownItem
            on:click={() => {
              InfoRouter(ROUTE_FILTER_ETUDIANT);
            }}>{TITLE_FILTERETUDIANTS}</DropdownItem
          >
          <DropdownItem divider />
          <DropdownItem
            disabled={anneeid.length < 1 || groupeid.length < 1}
            on:click={() => {
              InfoRouter(
                ROUTE_ETUDAFFECTATIONS_LIST + "/" + anneeid + "/" + groupeid
              );
            }}>{TITLE_ETUDAFFECTATIONS_LIST}</DropdownItem
          >
          <DropdownItem divider />
          <DropdownItem
            on:click={() => {
              InfoRouter(ROUTE_ANNEES_LIST);
            }}>{TITLE_ANNEES}</DropdownItem
          >
          <DropdownItem divider />
          <DropdownItem
            disabled={matiereid.length < 1 || semestreid.length < 1}
            on:click={() => {
              InfoRouter(
                ROUTE_GROUPECONTROLES_LIST + "/" + semestreid + "/" + matiereid
              );
            }}>{TITLE_GROUPESCONTROLES}</DropdownItem
          >
          <DropdownItem divider />
          <DropdownItem
            disabled={semestreid.length < 1}
            on:click={() => {
              InfoRouter(ROUTE_GROUPES_LIST + "/" + semestreid);
            }}>{TITLE_GROUPES}</DropdownItem
          >
          <DropdownItem
            disabled={uniteid.length < 1}
            on:click={() => {
              InfoRouter(ROUTE_MATIERES_LIST + "/" + uniteid);
            }}>{TITLE_MATIERES}</DropdownItem
          >
          <DropdownItem
            on:click={() => {
              InfoRouter(ROUTE_SEMESTRES_LIST);
            }}>{TITLE_SEMESTRES}</DropdownItem
          >
          <DropdownItem
            on:click={() => {
              InfoRouter(ROUTE_UNITES_LIST);
            }}>{TITLE_UNITES}</DropdownItem
          >
        </DropdownMenu>
      </Dropdown>
    </Nav>
  </Collapse>
</Navbar>
