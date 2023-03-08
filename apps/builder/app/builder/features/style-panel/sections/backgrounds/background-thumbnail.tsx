import { Image as WebstudioImage, loaders } from "@webstudio-is/image";
import { styled, theme } from "@webstudio-is/design-system";
import type { StyleInfo } from "../../shared/style-info";
import brokenImage from "~/shared/images/broken-image-placeholder.svg";
import env from "~/shared/env";

const Thumbnail = styled("div", {
  width: theme.spacing[10],
  height: theme.spacing[10],
  backgroundImage: "linear-gradient(yellow, red)",
});

const NoneThumbnail = styled("div", {
  width: theme.spacing[10],
  height: theme.spacing[10],
  background:
    "repeating-conic-gradient(rgba(0,0,0,0.22) 0% 25%, transparent 0% 50%) 0% 33.33% / 40% 40%",
});

const StyledWebstudioImage = styled(WebstudioImage, {
  position: "relative",
  width: theme.spacing[10],
  height: theme.spacing[10],
  objectFit: "contain",

  // This is shown only if an image was not loaded and broken
  // From the spec:
  // - The pseudo-elements generated by ::before and ::after are contained by the element's formatting box,
  //   and thus don't apply to "replaced" elements such as <img>, or to <br> elements
  // Not in spec but supported by all browsers:
  // - broken image is not a "replaced" element so this style is applied
  "&::after": {
    content: "' '",
    position: "absolute",
    width: "100%",
    height: "100%",
    left: 0,
    top: 0,
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundImage: `url(${brokenImage})`,
  },
});

export const getLayerName = (layerStyle: StyleInfo) => {
  const backgroundImageStyle = layerStyle.backgroundImage?.value;
  if (backgroundImageStyle?.type === "image") {
    return "Image"; // backgroundImageStyle.value.value.name;
  }

  if (backgroundImageStyle?.type === "unparsed") {
    return "Gradient";
  }

  return "None";
};

export const LayerThumbnail = (props: { layerStyle: StyleInfo }) => {
  const backgroundImageStyle = props.layerStyle.backgroundImage?.value;

  if (backgroundImageStyle?.type === "image") {
    const asset = backgroundImageStyle.value.value;
    const remoteLocation = asset.location === "REMOTE";

    const loader = remoteLocation
      ? loaders.cloudflareImageLoader({
          resizeOrigin: env.RESIZE_ORIGIN,
        })
      : loaders.localImageLoader();

    return (
      <StyledWebstudioImage
        key={asset.id}
        loader={loader}
        src={asset.path}
        width={theme.spacing[10]}
        optimize={true}
        alt={getLayerName(props.layerStyle)}
      />
    );
  }

  if (backgroundImageStyle?.type === "unparsed") {
    return <Thumbnail />;
  }

  return <NoneThumbnail />;
};