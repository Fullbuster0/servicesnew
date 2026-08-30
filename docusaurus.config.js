// @ts-check
import { themes as prismThemes } from "prism-react-renderer";

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Shazoes",
  tagline: "Trusted Blockchain Validator",
  favicon: "img/shazoes.ico",

  url: "https://services.shazoes.xyz",
  baseUrl: "/",

  organizationName: "Shazoes",
  projectName: "Shazoes",

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.js",
          routeBasePath: "yay",
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
      },
    ],
  ],

  plugins: [
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "mainnets",
        path: "mainnets",
        routeBasePath: "mainnets",
        sidebarPath: require.resolve("./sidebarsMainnets.js"),
      },
    ],
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "testnets",
        path: "testnets",
        routeBasePath: "testnets",
        sidebarPath: require.resolve("./sidebarsTestnets.js"),
      },
    ],
  ],

  themeConfig: {
    navbar: {
      title: "Shazoes",
      logo: {
        alt: "Shazoes Logo",
        src: "img/shazoes.ico",
      },
      items: [
        { to: "/mainnets", position: "left", label: "Mainnets" },
        { to: "/testnets", label: "Testnets", position: "left" },
        { to: "/relayers", label: "Relayers", position: "left" },
        { href: "https://monitor.shazoes.xyz", label: "Monitoring", position: "right" },
        { href: "https://explorer.shazoes.xyz", label: "Explorer", position: "right" },
        { href: "https://faucet.shazoes.xyz", label: "Faucet", position: "right" },
      ],
    },

    prism: {
      // Measured WCAG sweep over all 20 bundled themes (script /tmp/themecontrast.js):
      //   github      -> 23 of 30 token colours fail 4.5:1 (worst #36acaa = 2.58:1)
      //   dracula     -> comment 3.03:1, and its plain #F8F8F2 leaked into our
      //                  darker surface leaving operators/punctuation at 1.48:1
      //   vsLight     -> 1 of 18 fail (worst 4.00:1; patched in custom.css)
      //   oceanicNext -> 0 of 31 fail (worst 4.68:1)
      // prism-react-renderer writes per-token INLINE style="color:#..", so CSS
      // can only override it with !important — see custom.css §PRISM TOKEN CONTRAST.
      theme: prismThemes.vsLight,
      darkTheme: prismThemes.oceanicNext,
    },
  },
};

export default config;
