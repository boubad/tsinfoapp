<script lang="ts">
  import Router from "svelte-spa-router";
  import { Col, Row } from "sveltestrap";
  import InfoNav from "./InfoNav.svelte";
  import Global from "./lib/svelte/features/global/Global.svelte";
  import { routes } from "./routes/routes";
</script>

<div>
  <Row>
    <Col xs="1" />
    <Col>
      <InfoNav />
    </Col>
    <Col xs="1" />
  </Row>
  <Row>
    <Col xs="1" />
    <Col>
      <Global />
    </Col>
    <Col xs="1" />
  </Row>
  <Row>
    <Col xs="1" />
    <!-- Show the router -->
    <Col>
      <Router {routes} />
    </Col>
    <Col xs="1" />
  </Row>
</div>
