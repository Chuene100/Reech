import { images } from "../../../constants";

{
  /*work style idea oriented people*/
}

//idea oriented people data
export const ideaOrientedPeopleData = [
  {
    id: 1,
    userImage: images.sup3,
    username: "Thandi Modise",
    userBlurb:
      "I'm a Civil Engineer by profession. In my spare time I do stand-up comedy and I'm the proud owner of Thandi Fashions.",
    userHashTag: [
      {
        id: 1,
        hashTagText: "#IdeaOriented",
      },
      {
        id: 2,
        hashTagText: "#Hybrid",
      },
      {
        id: 3,
        hashTagText: "#Work",
      },
    ],
    isBubbleMate: false,
    sharedBubbleMates: [
      {
        id: 1,
        bubbleMateImage: images.Simphiwe,
      },
      {
        id: 2,
        bubbleMateImage: images.Julian,
      },
      {
        id: 3,
        bubbleMateImage: images.sup1,
      },
      {
        id: 4,
        bubbleMateImage: images.Bronwin,
      },
    ],
  },
];

//hybrid people data
export const hybridPeopleData = [
  {
    id: 1,
    userImage: images.farmer,
    username: "James Jackson",
    userBlurb:
      "I am a standup comedian by profession, and during my leisure time, I like to volunteer at old age homes and I run an online cooking show.",
    userHashTag: [
      {
        id: 1,
        hashTagText: "#Hybrid",
      },
    ],
    isBubbleMate: false,
    sharedBubbleMates: [
      {
        id: 1,
        bubbleMateImage: images.Bronwin,
      },
      {
        id: 2,
        bubbleMateImage: images.James,
      },
      {
        id: 3,
        bubbleMateImage: images.Pm,
      },
    ],
  },
  {
    id: 2,
    userImage: images.Ajo2,
    username: "Simon Gibson",
    userBlurb:
      "I am a Digital Marketer based in Santa Maria and I also run business based in New York City that sells steel pipes to NGOs.",
    userHashTag: [
      {
        id: 1,
        hashTagText: "#Hybrid",
      },
      {
        id: 1,
        hashTagText: "#WorkStyle",
      },
    ],
    isBubbleMate: true,
    sharedBubbleMates: [
      {
        id: 1,
        bubbleMateImage: images.Sam,
      },
      {
        id: 2,
        bubbleMateImage: images.Simphiwe,
      },
      {
        id: 3,
        bubbleMateImage: images.sup3,
      },
      {
        id: 4,
        bubbleMateImage: images.sup1,
      },
      {
        id: 5,
        bubbleMateImage: images.sup5,
      },
      {
        id: 6,
        bubbleMateImage: images.Simphiwe,
      },
      {
        id: 7,
        bubbleMateImage: images.sup8,
      },
    ],
  },
  {
    id: 3,
    userImage: images.sup5,
    username: "Kevin Yankees",
    userBlurb:
      "I am a cool guy who loves to build mobile apps for startup companies and during my spare time I love to volunteer at old age homes.",
    userHashTag: [
      {
        id: 1,
        hashTagText: "#WorkStyle",
      },
    ],
    isBubbleMate: true,
    sharedBubbleMates: [
      {
        id: 1,
        bubbleMateImage: images.Simon,
      },
      {
        id: 2,
        bubbleMateImage: images.Simphiwe,
      },
    ],
  },
];

{
  /*work style idea oriented places*/
}

//idea oriented places data
export const ideaOrientedPlacesData = [
  {
    id: 1,
    placeImage: {
      uri: "https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_256,w_256,f_auto,q_auto:eco,dpr_1/v1488848900/mc8uavga07ee6xrbbljw.png",
    },
    placeName: "Rockefeller Foundation",
    placeBlurb:
      "The Rockefeller Foundation is a philanthropic organization that supports innovative solutions to global challenges.",
    placeHashTag: [
      {
        id: 1,
        hashTagText: "#IdeaOriented",
      },
      {
        id: 2,
        hashTagText: "#Work",
      },
    ],
    isAddedToWishlist: false,
  },
  {
    id: 2,
    placeImage: {
      uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/LinkedIn_logo_initials.png/800px-LinkedIn_logo_initials.png",
    },
    placeName: "LinkedIn",
    placeBlurb:
      "LinkedIn is a business and employment-focused social media platform that works through websites and mobile apps.",
    placeHashTag: [
      {
        id: 1,
        hashTagText: "#Community",
      },
      {
        id: 2,
        hashTagText: "#Engagement",
      },
    ],
    isAddedToWishlist: true,
  },
];

//hybrid places data
export const hybridPlacesData = [
  {
    id: 1,
    placeImage: {
      uri: "https://m.media-amazon.com/images/I/31epF-8N9LL.png",
    },
    placeName: "Amazon",
    placeBlurb:
      "Amazon.com, Inc. is an American multinational technology company focusing on e-commerce, cloud computing, online advertising, digital streaming, and artificial intelligence.",
    placeHashTag: [
      {
        id: 1,
        hashTagText: "#Business",
      },
      {
        id: 2,
        hashTagText: "#eCommerce",
      },
    ],
    isAddedToWishlist: false,
  },
  {
    id: 2,
    placeImage: {
      uri: "https://images.idgesg.net/images/article/2020/06/apple-logo-black-white-100850170-large.jpg?auto=webp&quality=85,70",
    },
    placeName: "Apple",
    placeBlurb:
      "Apple is an American computer and consumer electronics company famous for creating the iPhone, iPad and Macintosh computers.",
    placeHashTag: [
      {
        id: 1,
        hashTagText: "#eCommerce",
      },
      {
        id: 2,
        hashTagText: "#Electronics",
      },
      {
        id: 3,
        hashTagText: "#Business",
      },
    ],
    isAddedToWishlist: true,
  },
  {
    id: 3,
    placeImage: {
      uri: "https://cdn1.iconfinder.com/data/icons/flat-and-simple-part-1/128/microsoft-512.png",
    },
    placeName: "Microsoft",
    placeBlurb:
      "Microsoft Corporation is an American multinational technology corporation headquartered in Redmond, Washington.",
    placeHashTag: [
      {
        id: 1,
        hashTagText: "#Software",
      },
      {
        id: 2,
        hashTagText: "#Applications",
      },
    ],
    isAddedToWishlist: false,
  },
  {
    id: 4,
    placeImage: {
      uri: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/Starbucks_Corporation_Logo_2011.svg/800px-Starbucks_Corporation_Logo_2011.svg.png",
    },
    placeName: "Starbucks",
    placeBlurb:
      "Starbucks Corporation is an American multinational chain of coffeehouses and roastery reserves headquartered in Seattle, Washington.",
    placeHashTag: [
      {
        id: 1,
        hashTagText: "#Community",
      },
      {
        id: 2,
        hashTagText: "#Food",
      },
    ],
    isAddedToWishlist: true,
  },
  {
    id: 5,
    placeImage: {
      uri: "https://deadline.com/wp-content/uploads/2019/08/marvel_entertainment_logo_2002.jpg",
    },
    placeName: "Marvel Studios",
    placeBlurb:
      "Marvel Studios is an entertainment brand defined the stories and successes of our more than 8,000 incredible characters like Iron Man, Thor, Black Panther and Captain America.",
    placeHashTag: [
      {
        id: 1,
        hashTagText: "#Stream",
      },
      {
        id: 2,
        hashTagText: "#Movies",
      },
      {
        id: 3,
        hashTagText: "#Entertainment",
      },
    ],
    isAddedToWishlist: true,
  },
];
