import { images } from "../../../constants";

//search for place - bubble mates and not bubble mate
export const placeResultData = [
  {
    id: 1,
    action: "AccountFullViewScreen",
    accountProfilePicture: { uri: images.butchery },
    accountName: "Steakhouse & Grill Valley",
    location: "Germiston, South Africa",
    accountBlurb:
      "A fine dining restaurant specializing in providing our customers with a variety of steak.",
    bubbleMate: false,
    bubbleMates: [],
  },
  {
    id: 2,
    action: "AccountFullViewScreen",
    accountProfilePicture: { uri: images.farm },
    location: "Limpopo, South Africa",
    accountName: "Farmers Market",
    accountBlurb:
      "We at Farmers Market aim to provide our clients with the freshes steak and veggies while ensuring that all our products are always fresh, tasty and delicious, always.",
    bubbleMate: true,
    bubbleMates: [
      {
        id: 1,
        bubbleMateImage: { uri: images.Michael },
      },
      {
        id: 2,
        bubbleMateImage: { uri: images.Simon },
      },
      {
        id: 3,
        bubbleMateImage: { uri: images.Sam },
      },
      {
        id: 4,
        bubbleMateImage: { uri: images.sup2 },
      },
      {
        id: 5,
        bubbleMateImage: { uri: images.sup1 },
      },
    ],
  },
  {
    id: 3,
    action: "AccountFullViewScreen",
    accountProfilePicture: { uri: images.dine },
    location: "Johanneburg, South Africa",
    accountName: "Golden Valley",
    accountBlurb:
      "A fine dining restaurant providing South African traditional dishes.",
    bubbleMate: true,
    bubbleMates: [
      {
        id: 1,
        bubbleMateImage: { uri: images.sup7 },
      },
      {
        id: 2,
        bubbleMateImage: { uri: images.sup4 },
      },
      {
        id: 3,
        bubbleMateImage: { uri: images.sup9 },
      },
    ],
  },
];
