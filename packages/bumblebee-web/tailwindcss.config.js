const plugin = require("tailwindcss/plugin");
const basePath = __dirname.replace(/\\/g, "/");

const notoSans = {
  "@font-face": [
    {
      fontFamily: "Noto Sans HK",
      fontStyle: "normal",
      fontWeight: 100,
      src: `url("${basePath}/src/assets/fonts/NotoSansHK-Thin.otf") format("opentype")`,
    },
    {
      fontFamily: "Noto Sans HK",
      fontStyle: "normal",
      fontWeight: 300,
      src: `url("${basePath}/src/assets/fonts/NotoSansHK-Light.otf") format("opentype")`,
    },
    {
      fontFamily: "Noto Sans HK",
      fontStyle: "normal",
      fontWeight: 400,
      src: `url("${basePath}/src/assets/fonts/NotoSansHK-Regular.otf") format("opentype")`,
    },
    {
      fontFamily: "Noto Sans HK",
      fontStyle: "normal",
      fontWeight: 500,
      src: `url("${basePath}/src/assets/fonts/NotoSansHK-Medium.otf") format("opentype")`,
    },
    {
      fontFamily: "Noto Sans HK",
      fontStyle: "normal",
      fontWeight: 700,
      src: `url("${basePath}/src/assets/fonts/NotoSansHK-Bold.otf") format("opentype")`,
    },
    {
      fontFamily: "Noto Sans HK",
      fontStyle: "normal",
      fontWeight: 900,
      src: `url("${basePath}/src/assets/fonts/NotoSansHK-Black.otf") format("opentype")`,
    },
  ],
};

module.exports = {
  purge: [],
  theme: {
    extend: {
      colors: {
        "winter-pastel": "#D1D0CC",
        "soft-winter-grey": "#EBEBEB",
        "winter-grey": "#ADB9C9",
        "soft-berry": "#374258",
        berry: "#0F1427",
      },
    },
  },
  variants: {},
  plugins: [
    plugin(function ({ addUtilities, addComponents, e, prefix, config }) {
      // Add your custom styles here

      addComponents([notoSans]);
    }),
  ],
};
