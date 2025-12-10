
import vegetables from "../assets/carousel/vegetables.webp";
import vegetablesD from "../assets/carousel/vegetables-desktop.webp";
import fries from "../assets/carousel/fries.webp";
import friesD from "../assets/carousel/fries-desktop.webp";
import noodles from "../assets/carousel/noodles.webp";
import noodlesD from "../assets/carousel/noodles-desktop.webp";
import logolight from "../assets/logolight.svg";

type Slide = {
  desktop: string;
  mobile: string;
  overlay?: {
    heading: string;
    subtext?: string;
    buttonText?: string;
    buttonLink?: string;
    logo?: string;
  };
};

export const slides: Slide[] = [
  {
    desktop: vegetablesD,
    mobile: vegetables,
    overlay: {
      heading: "Welcome to",
      subtext:
        "Discover meals, ingredients, and inspiration. Let’s get cooking!",
      logo: logolight,
    },
  },
  {
    desktop: friesD,
    mobile: fries,
    overlay: {
      heading: "Find Something Delicious",
      subtext:
        "Want to browse recipes? Head over to the search page to explore meals by name, ingredients, and more!",
      buttonText: "To Search",
      buttonLink: "/project2/search",
    },
  },
  {
    desktop: noodlesD,
    mobile: noodles,
    overlay: {
      heading: "Feeling indecisive?",
      subtext:
        "Don't know what you are craving? Let us pick something for you!",
      buttonText: "Get random recipe",
      buttonLink: "/project2/recipe/All",
    },
  }
];
