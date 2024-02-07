import PageComposition from "@/components/PageComposition";
import {
  prependLocale,
  withUniformGetServerSideProps,
  withUniformGetStaticProps,
} from "@uniformdev/canvas-next/route";
import { CANVAS_DRAFT_STATE, CANVAS_PUBLISHED_STATE } from "@uniformdev/canvas";
import { GetStaticPaths, GetStaticPropsContext } from "next";

//statically pre-render all the paths
export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking", // paths that has not been generated at build time will not result in a 404 page but instea SSR on the first request and return the HTML
  };
};

const locale = "en-GB";

//Modifys props and composition data - static props with uniform composition logic
export const getStaticProps = withUniformGetStaticProps({
  // fetching composition. Draftmode for dev else publishedmode
  requestOptions: {
    state:
      process.env.NODE_ENV === "development"
        ? CANVAS_DRAFT_STATE
        : CANVAS_PUBLISHED_STATE,
  },
  //1. option in regards to fetch composition path with nextjs localization
  // param: "slug", // Name of dynamic parameter coming from getStaticPath has name "slug"
  // modifyPath: prependLocale,
  //1. option in regards to fetch composition path with what i think can fit with our current logic
  modifyPath: (_locale, { params }) => {
    const { slug } = params || {};
    // let locale = context?.params?.locale;
    return "/en-GB/" + slug;
  },
  //handler for composition route response
  handleComposition: async (routeResponse, _context, _defaultHandler) => {
    const { composition } = routeResponse.compositionApiResponse || {};
    // Returning the props object to the page composition
    return {
      props: {
        data: composition,
      },
    };
  },
});

export default PageComposition;
