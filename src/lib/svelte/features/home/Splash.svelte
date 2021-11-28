<script lang="ts">
    import { Row } from "sveltestrap";
    import environment from "../../../../environment";

</script>

<div>
    <Row>
        <img
            src={environment.splashImageUrl}
            alt={environment.splashImageAlt}
            height="100%"
        />
    </Row>
</div>
