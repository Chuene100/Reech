import { images, videos } from "../../../constants";

//User how-to video data
export const howToVideoData = [
  {
    id: 1,
    video: videos?.v1,
    userTitle: "Janak Bhaktha",
    userProfileName: "the photographer",
    isFollow: false,
    totalVideos: 10,
    videoChannel: "Science & Technology",
    blurb:
      "I am a Photographer by profession, and during my spare time I am a resident deejay at News Cafe.",
    userAccountImage: { uri: images.Simon },
    videoName: "Nikon Camera",
    description:
      "How to take still pictures and add moving effects to them. You do not have to buy any libraries or softwares to do. All you need is the Adobe package and we are good to go 😊. Let's get learning guys.",
    commentCount: 60,
    appreciationCount: 490,
    shareCount: 19,
    isAppreciated: false,
    viewerImage: { uri: images.p7 },
    saved: false,
    userComments: [
      {
        id: 1,
        userPic: { uri: images.sup1 },
        userName: "Bontle Sibanyoni",
        userComment:
          "Damn, you are really good at what you do, can you please teach me 😊. I really enjoyed the part where you showed us how to take a landscape snapshot using our mobile phones that comes out as a picture taken using a camera.",
        commentTimeStamp: "just now",
      },
      {
        id: 2,
        userPic: { uri: images.sup5 },
        userName: "Andile Sibiya",
        userComment:
          "Can you please create something like this for me. I will send you the details into your inbox.",
        commentTimeStamp: "10 mins ago",
      },
      {
        id: 3,
        userPic: { uri: images.sup3 },
        userName: "Khanyisile Ngwenya",
        userComment:
          "Best content on Reech. I cannot wait to see more of your content.",
        commentTimeStamp: "13 hours ago",
      },
    ],
  },
  {
    id: 2,
    video: videos?.v2,
    userTitle: "Jessica Shabalala",
    userProfileName: "the agricultural teacher",
    blurb:
      "I am Agricultural Teacher by profession, and during my spare time I am an Amateur Pastry Chef.",
    isFollow: true,
    totalVideos: 32,
    videoChannel: "The Environment",
    userAccountImage: { uri: images.sup3 },
    videoName: "Witbank outdoor experiences",
    description:
      "How to grow grains and make them delicious with every meal you may prepare 😋. With the lessons that I am about to show you, you won't stop using this teaching 😄.",
    commentCount: 31,
    appreciationCount: 423,
    shareCount: 90,
    isAppreciated: false,
    viewerImage: { uri: images.p7 },
    saved: false,
    userComments: [
      {
        id: 1,
        userPic: { uri: images.sup4 },
        userName: "Nathan Abrams",
        userComment: "Insightful information ❤. ️ ",
        commentTimeStamp: "just now",
      },
      {
        id: 2,
        userPic: { uri: images.sup5 },
        userName: "Gary Xavier",
        userComment:
          "I really enjoy watching your how-to videos?. Keep up the great content. You're highly recommended!",
        commentTimeStamp: "25 mins ago",
      },
      {
        id: 3,
        userPic: { uri: images.sup1 },
        userName: "Bontle Sibanyoni",
        userComment: "Thank you for the teachings.",
        commentTimeStamp: "4 hours ago",
      },
    ],
  },
  // {
  //   id: 3,
  //   video: videos?.v4,
  //   userTitle: "Nikkita Govender",
  //   userProfileName: "the software engineer",
  //   blurb:
  //     "I am Software Engineer by profession, and during my spare time I am a bar tender.",
  //   isFollow: false,
  //   totalVideos: 153,
  //   videoChannel: "Science & Technology",
  //   userAccountImage: { uri: images.Bronwin },
  //   videoName: "New workstation setup",
  //   description:
  //     "How to become a prodigy in web development. Here are a few illustrations of the images I think you will like. Learn the best practices and also be familiar with front-end and back-end technologies. Let's get coding.",
  //   commentCount: 40,
  //   appreciationCount: 500,
  //   shareCount: 5,
  //   isAppreciated: false,
  //   viewerImage: { uri: images.p7 },
  //   saved: false,
  //   userComments: [
  //     {
  //       id: 1,
  //       userPic: { uri: images.sup6 },
  //       userName: "Daniel Naidoo",
  //       userComment:
  //         "Ever since I started watching your how-to videos, I have learnt a lot about web development. You rock Sammy!",
  //       commentTimeStamp: "just now",
  //     },
  //     {
  //       id: 2,
  //       userPic: { uri: images.sup3 },
  //       userName: "Keletso Qaba",
  //       userComment:
  //         "Sammy you really motivate everyday with these how-to videos of yours. Gosh, you have saved me from imposter syndrome.",
  //       commentTimeStamp: "just now",
  //     },
  //     {
  //       id: 3,
  //       userPic: { uri: images.sup4 },
  //       userName: "Sam Brown",
  //       userComment:
  //         "Can you please create a how-to video to building a web application using AngularJS?",
  //       commentTimeStamp: "just now",
  //     },
  //     {
  //       id: 3,
  //       userPic: { uri: images.sup7 },
  //       userName: "Eric Mavimbela",
  //       userComment: "Take you for teaching us Sammy 🥹.",
  //       commentTimeStamp: "just now",
  //     },
  //   ],
  // },
  // {
  //   id: 4,
  //   video: videos?.v7,
  //   userTitle: "Simphiwe Lukhele",
  //   userProfileName: "the investor",
  //   blurb:
  //     "I am an Investor by profession, and during my spare time I am a Soccer Coach.",
  //   isFollow: true,
  //   totalVideos: 43,
  //   videoChannel: "Business",
  //   userAccountImage: { uri: images.Simphiwe },
  //   videoName: "Best trading advices",
  //   description:
  //     "How to make better financial risks and stay on top of your competitors.",
  //   commentCount: 13,
  //   appreciationCount: 782,
  //   shareCount: 89,
  //   isAppreciated: false,
  //   viewerImage: { uri: images.p7 },
  //   saved: false,
  //   userComments: [
  //     {
  //       id: 1,
  //       userPic: { uri: images.sup10 },
  //       userName: "Ryan Green",
  //       userComment:
  //         "Please create a how to video demonstrating how to use pips",

  //       commentTimeStamp: "just now",
  //     },
  //     {
  //       id: 2,
  //       userPic: { uri: images.sup9 },
  //       userName: "Jackson South",
  //       userComment:
  //         "I have been losing so much money before I stumbled on your content. You have really saved me a lot of money and for that I wanna thank you and vouch for you.",
  //       commentTimeStamp: "43 secs ago",
  //     },
  //     {
  //       id: 3,
  //       userPic: { uri: images.sup8 },
  //       userName: "Nkunzi Mhlongo",
  //       userComment:
  //         "You are really the best investment coach out there 🤩💰. You are going places to for sharing with us.",
  //       commentTimeStamp: "15 mins ago",
  //     },
  //     {
  //       id: 4,
  //       userPic: { uri: images.sup1 },
  //       userName: "Dintle Zwide",
  //       userComment:
  //         "Please share a how to video demoing how to sell big and what are the risks associated with that kind of trade.",
  //       commentTimeStamp: "30 mins ago",
  //     },
  //   ],
  // },
  // {
  //   id: 5,
  //   video: videos?.v5,
  //   userTitle: "Elizabeth Ladoni",
  //   userProfileName: "the au pair",
  //   blurb:
  //     "I am an Au Pair by profession, and during my spare time I am a Project Management Lecture at UNISA.",
  //   isFollow: false,
  //   totalVideos: 65,
  //   videoChannel: "Kids & Family",
  //   userAccountImage: { uri: images.sup1 },
  //   videoName: "How to stay sane as an au pair",
  //   description:
  //     "How to stay calm as an Au Pair when faced with hysterical kids.",
  //   commentCount: 5,
  //   appreciationCount: 84,
  //   shareCount: 2,
  //   isAppreciated: false,
  //   viewerImage: { uri: images.p7 },
  //   saved: false,
  //   userComments: [
  //     {
  //       id: 1,
  //       userPic: { uri: images.sup3 },
  //       userName: "Simphiwe Chabangu",
  //       userComment:
  //         "Since I watched your videos, I have never had any issues with the little one's since I apply your teachings to my situations. Thanks for sharing such insightful content. #NumberOneFan",
  //       commentTimeStamp: "just now",
  //     },
  //     {
  //       id: 2,
  //       userPic: { uri: images.sup10 },
  //       userName: "Obed Seer",
  //       userComment:
  //         "I have a naughty 6-year-old and I don't want to raise my hands on him, how can I tame him non-physically?",
  //       commentTimeStamp: "1 hour ago",
  //     },
  //   ],
  // },
  // {
  //   id: 6,
  //   video: videos?.v6,
  //   userTitle: "Kayle Van Tonder",
  //   userProfileName: "the choreographer",
  //   blurb:
  //     "I am a Choreographer by profession, and during my spare time I run a Nursery.",
  //   isFollow: false,
  //   totalVideos: 75,
  //   videoChannel: "Music & Entertainment",
  //   userAccountImage: { uri: images.Nicole },
  //   videoName: "Hamba wena dance challenge",
  //   description:
  //     "How to do the sleek dance. I tried my best to demonstrate on how to do it 😅. ",
  //   commentCount: 23,
  //   appreciationCount: 899,
  //   shareCount: 90,
  //   isAppreciated: false,
  //   viewerImage: { uri: images.p7 },
  //   saved: false,
  //   userComments: [
  //     {
  //       id: 1,
  //       userPic: { uri: images.sup1 },
  //       userName: "Bontle Dlamini",
  //       userComment:
  //         "Where did you learn to dance because you are really good! I'm so jealous - teach me more ❤️🥹",
  //       commentTimeStamp: "just now",
  //     },
  //     {
  //       id: 2,
  //       userPic: { uri: images.sup7 },
  //       userName: "Evan Khumalo",
  //       userComment:
  //         "Damn, you have shown me a lot recently and now I can easily move without breaking a sweat. You Are A Good Teacher! Props given to you.",
  //       commentTimeStamp: "23 secs ago",
  //     },
  //     {
  //       id: 3,
  //       userPic: { uri: images.sup2 },
  //       userName: "Helen Zille",
  //       userComment: "I love your content. Please share more.",
  //       commentTimeStamp: "1 mins ago",
  //     },
  //     {
  //       id: 4,
  //       userPic: { uri: images.sup9 },
  //       userName: "Johnathan York",
  //       userComment:
  //         "I have slimmed down because of your how to videos, the moves are effective. Thanks a million!",
  //       commentTimeStamp: "2 mins ago",
  //     },
  //     {
  //       id: 5,
  //       userPic: { uri: images.Michael },
  //       userName: "Bianca Xavier",
  //       userComment:
  //         "I am glad you are now making traction my friend. Keep up the good content.",
  //       commentTimeStamp: "3 mins ago",
  //     },
  //   ],
  // },
  // {
  //   id: 10,
  //   video: videos?.v10,
  //   userTitle: "Danny Xavier",
  //   userProfileName: "the love therapist",
  //   blurb:
  //     "I am a Love Therapist aka Love Doctor by profession, and during my spare time I travel the world.",
  //   isFollow: false,
  //   totalVideos: 32,
  //   videoChannel: "Life",
  //   userAccountImage: { uri: images.sup10 },
  //   videoName: "How to keep falling in love",
  //   description:
  //     "How to communicate with your partner and get most out of each other. I will be sharing some important steps to show you how you can communicate with your partner without even saying a word. These practices have been tested and the results were 89.6% percent accurate. Let me show you these steps.",
  //   commentCount: 56,
  //   appreciationCount: 542,
  //   shareCount: 10,
  //   isAppreciated: false,
  //   viewerImage: { uri: images.p7 },
  //   saved: false,
  //   userComments: [
  //     {
  //       id: 1,
  //       userPic: { uri: images.Nicole },
  //       userName: "Nicole Van Wyk",
  //       userComment:
  //         "I have found my partner because of your teachings. God bless you!",
  //       commentTimeStamp: "just now",
  //     },
  //     {
  //       id: 2,
  //       userPic: { uri: images.Pm },
  //       userName: "Nkululeko Gumba",
  //       userComment:
  //         "I learnt a lot from you. My partner and I are no longer cold to one another. Best therapist in the world.",
  //       commentTimeStamp: "3 mins ago",
  //     },
  //     {
  //       id: 3,
  //       userPic: { uri: images.Ajo },
  //       userName: "Kevin Smith",
  //       userComment: "Thanks for the content you keep bless us with.",
  //       commentTimeStamp: "15 mins ago",
  //     },
  //     {
  //       id: 4,
  //       userPic: { uri: images.Michael },
  //       userName: "Jessica Smith",
  //       userComment: "Wonderful!",
  //       commentTimeStamp: "29 mins ago",
  //     },
  //     {
  //       id: 5,
  //       userPic: { uri: images.sup1 },
  //       userName: "Enicah Mazibuko",
  //       userComment: "I really love your content, keep sharing please.",
  //       commentTimeStamp: "3 hours ago",
  //     },
  //   ],
  // },
  // {
  //   id: 11,
  //   video: videos?.v8,
  //   userTitle: "Wesley Bhaktha",
  //   userProfileName: "the Nurse",
  //   isFollow: false,
  //   totalVideos: 8,
  //   videoChannel: "Health & Wellness",
  //   blurb: "How to treat an ear infection.",
  //   userAccountImage: { uri: images.Simon },
  //   videoName: "Ear infection treatments",
  //   description:
  //     "Treatment varies and may include watchful waiting, antibiotics or anti-inflammatory medicines.",
  //   commentCount: 2,
  //   appreciationCount: 32,
  //   shareCount: 81,
  //   isAppreciated: false,
  //   viewerImage: { uri: images.p7 },
  //   saved: false,
  //   userComments: [
  //     {
  //       id: 1,
  //       userPic: { uri: images.sup4 },
  //       userName: "Gavin Smith",
  //       userComment:
  //         "I really learnt a lot and I will use these methods next time.",
  //       commentTimeStamp: "43 secs ago",
  //     },
  //     {
  //       id: 2,
  //       userPic: { uri: images.sup6 },
  //       userName: "Leo Govender",
  //       userComment: "These are some helpful tips, thanks for sharing.",
  //       commentTimeStamp: "3 mins ago",
  //     },
  //     {
  //       id: 3,
  //       userPic: { uri: images.sup8 },
  //       userName: "Thabang Khumalo",
  //       userComment: "Thank you for sharing.",
  //       commentTimeStamp: "16 mins ago",
  //     },
  //   ],
  // },
  // {
  //   id: 13,
  //   video: videos?.v11,
  //   userTitle: "Steven Van Wyk",
  //   userProfileName: "the Plumber",
  //   isFollow: false,
  //   totalVideos: 52,
  //   videoChannel: "Engineering",
  //   blurb: "How to unblock a drain.",
  //   userAccountImage: {
  //     uri: "https://www.pngkey.com/png/detail/356-3568948_calling-a-plumber-vs-plumber-png.png",
  //   },
  //   videoName: "How to unblock a drain",
  //   description:
  //     "Try flushing one cup of bicarbonate of soda and one cup of vinegar down the drain after pouring hot water down it first. After 10 minutes, follow up with more hot water.",
  //   commentCount: 89,
  //   appreciationCount: 488,
  //   shareCount: 29,
  //   isAppreciated: false,
  //   viewerImage: { uri: images.p7 },
  //   saved: false,
  //   userComments: [
  //     {
  //       id: 1,
  //       userPic: {
  //         uri: "https://images.unsplash.com/photo-1622128109828-306c6fb4b119?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1633&q=80",
  //       },
  //       userName: "Brian Jackson",
  //       userComment:
  //         "I didn't realise that it was this simple to unblock my drain. You the best man, you've saved me thousands!",
  //       commentTimeStamp: "3 mins ago",
  //     },
  //     {
  //       id: 2,
  //       userPic: {
  //         uri: "https://images.unsplash.com/photo-1584549239925-5554aa6b9183?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80",
  //       },
  //       userName: "Jeff Hardy",
  //       userComment:
  //         "Thanks for sharing. You really are a life saver. We need more content like this.",
  //       commentTimeStamp: "10 mins ago",
  //     },
  //     {
  //       id: 3,
  //       userPic: {
  //         uri: "https://images.unsplash.com/photo-1630439924424-27ffde8160ab?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
  //       },
  //       userName: "Gavin Van Rensburg",
  //       userComment:
  //         "I watched on of your videos and it helped to solve my pipe problem. Please keep sharing more how-to videos?.",
  //       commentTimeStamp: "23 mins ago",
  //     },
  //     {
  //       id: 4,
  //       userPic: { uri: images.sup10 },
  //       userName: "Danny Xavier",
  //       userComment: "How much do you charge per hour?",
  //       commentTimeStamp: "28 mins ago",
  //     },
  //   ],
  // },
  // {
  //   id: 14,
  //   video: videos?.v12,
  //   userTitle: "Kevin Mlambo",
  //   userProfileName: "the Software Engineer",
  //   isFollow: false,
  //   totalVideos: 45,
  //   videoChannel: "Science & Technology",
  //   blurb: "How to fix some bug.",
  //   userAccountImage: {
  //     uri: "https://images.unsplash.com/photo-1594077841990-3909f3a482a9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80",
  //   },
  //   videoName: "How to fix some bug",
  //   description:
  //     "According to Yoseph Radding, an Amazon software development engineer who also offers DevOps advice through Shuttl.io, you should still plan for when, not if, a bug occurs [there] even though we believe that we should do all in our ability to prevent bugs in production. By proactively addressing obstacles that could delay solutions, developers can ensure speedier resolution.",
  //   commentCount: 89,
  //   appreciationCount: 743,
  //   shareCount: 29,
  //   isAppreciated: false,
  //   viewerImage: { uri: images.p7 },
  //   saved: false,
  //   userComments: [
  //     {
  //       id: 1,
  //       userPic: {
  //         uri: "https://images.unsplash.com/photo-1544813813-2c73bec209ca?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1335&q=80",
  //       },
  //       userName: "James Mazibuko",
  //       userComment:
  //         "Thank you for sharing bro. I really learnt a lot from this.",
  //       commentTimeStamp: "3 mins ago",
  //     },
  //     {
  //       id: 2,
  //       userPic: {
  //         uri: "https://images.unsplash.com/photo-1581092918484-8313ada2183a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1287&q=80",
  //       },
  //       userName: "Mohammad Bhaktha",
  //       userComment:
  //         "Interesting read bro, thank you. Are you also interested in Machine Learning?",
  //       commentTimeStamp: "2 mins ago",
  //     },
  //   ],
  // },
  // {
  //   id: 15,
  //   video: videos?.v13,
  //   userTitle: "Tammy Smith",
  //   userProfileName: "the Venture Capitalist",
  //   isFollow: false,
  //   totalVideos: 14,
  //   videoChannel: "Business",
  //   blurb: "How to raise a series A",
  //   userAccountImage: {
  //     uri: "https://images.pexels.com/photos/7413986/pexels-photo-7413986.jpeg",
  //   },
  //   videoName: "How to raise a series A",
  //   description:
  //     "After you raise your Seed Round, establish key milestones that will enable a Series A raise and socialize these with trusted advisors. Begin to continuously review your fume date. Plan on initiating your Series A raise at least 6 months out from your fume date.",
  //   commentCount: 67,
  //   appreciationCount: 899,
  //   shareCount: 21,
  //   isAppreciated: false,
  //   viewerImage: { uri: images.p7 },
  //   saved: false,
  //   userComments: [
  //     {
  //       id: 1,
  //       userPic: {
  //         uri: "https://images.pexels.com/photos/7414283/pexels-photo-7414283.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  //       },
  //       userName: "Micheal Brown",
  //       userComment: "This is very insightful.",
  //       commentTimeStamp: "3 mins ago",
  //     },
  //     {
  //       id: 2,
  //       userPic: {
  //         uri: "https://images.pexels.com/photos/7414016/pexels-photo-7414016.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  //       },
  //       userName: "Darren Naidoo",
  //       userComment: "Interesting read, thank you.",
  //       commentTimeStamp: "5 mins ago",
  //     },
  //     {
  //       id: 3,
  //       userPic: {
  //         uri: "https://images.pexels.com/photos/36469/woman-person-flowers-wreaths.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  //       },
  //       userName: "Amander Van Wyk",
  //       userComment:
  //         "Can you teach me more about this topic, I need more lessons seriously. Do you offer any classes?",
  //       commentTimeStamp: "8 mins ago",
  //     },
  //     {
  //       id: 4,
  //       userPic: {
  //         uri: "https://images.pexels.com/photos/11515424/pexels-photo-11515424.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  //       },
  //       userName: "Lorraine Dlamini",
  //       userComment:
  //         "Thank you sharing this insightful read. You really know your work 🫡.",
  //       commentTimeStamp: "15 mins ago",
  //     },
  //     {
  //       id: 5,
  //       userPic: {
  //         uri: "https://images.pexels.com/photos/3778673/pexels-photo-3778673.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  //       },
  //       userName: "Chris Rock",
  //       userComment: "What an educational episode.",
  //       commentTimeStamp: "27 mins ago",
  //     },
  //     {
  //       id: 6,
  //       userPic: {
  //         uri: "https://images.pexels.com/photos/3206078/pexels-photo-3206078.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  //       },
  //       userName: "Thabo Mokete",
  //       userComment:
  //         "Can I ask, where are you based? I need to talk to you in person as I have this big plan and your expertise can turn this idea into reality",
  //       commentTimeStamp: "30 mins ago",
  //     },
  //   ],
  // },
];

//Reech recommendation how-to video
export const reechRecommendationVideo = [
  {
    id: 1,
    video: images.bg4,
    userTitle: "Jennifer Manzanillo",
    userProfileName: "Musician",
    isFollow: false,
    totalVideos: 5,
    videoChannel: "Music & Entertainment",
    blurb:
      "Jennifer Manzanillo is a Dominican-American youth educator and social entrepreneur. She was born and raised in Boston, Massachusetts",
    userAccountImage: "https://images.unsplash.com/photo-1641759653573-d5cbadb2b45d?auto=format&fit=crop&q=80&w=1335&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    videoName: "How to play piano chords",
    description:
      "I will show you how simple it is to play piano chords and create a melody out this, then you can choose how to transpose the chords to your liking.",
    commentCount: 583,
    appreciationCount: 86,
    shareCount: 24,
    isAppreciated: false,
    viewerImage: { uri: images.com },
    saved: false,
    userComments: [
      {
        id: 1,
        userPic: { uri: images.sup1 },
        userName: "Bontle Sibanyoni",
        userComment:
          "Damn, you are really good at what you do, can you please teach me 😊. I really enjoyed the part where you showed us how to take a landscape snapshot using our mobile phones that comes out as a picture taken using a camera.",
        commentTimeStamp: "just now",
      },
      {
        id: 2,
        userPic: { uri: images.sup5 },
        userName: "Andile Sibiya",
        userComment:
          "Can you please create something like this for me. I will send you the details into your inbox.",
        commentTimeStamp: "10 mins ago",
      },
      {
        id: 3,
        userPic: { uri: images.sup3 },
        userName: "Khanyisile Ngwenya",
        userComment:
          "Best content on Reech. I cannot wait to see more of your content.",
        commentTimeStamp: "13 hours ago",
      },
    ],
  },
];

//Reech recommendation thought content
export const reechRecommendationThought = [
  {
    id: 1,
    isVideo: false,
    video: {
      uri: "https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
    },
    userTitle: "Franklin Smith",
    userProfileName: "Diesel Mechanic",
    isFollow: false,
    totalVideos: 20,
    videoChannel: "Engineering",
    blurb:
      "Franklin Smith is a diesel mechanic who inspects, repairs and services diesel engines. As a diesel mechanic, I may work with a wide range of vehicles and machinery, including cars, buses, trucks and farm equipment.",
    userAccountImage: {
      uri: "https://images.unsplash.com/photo-1643700973089-baa86a1ab9ee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    },
    videoName: "What to know about diesel mechanics",
    description:
      "The upkeep and repair of diesel-powered vehicles is the responsibility of diesel mechanics. They must do diagnostic tests on automobiles, test drive them to evaluate performance, and keep thorough records of the vehicles they have serviced, among other tasks.",
    commentCount: 34,
    appreciationCount: 910,
    shareCount: 124,
    isAppreciated: false,
    viewerImage: { uri: images.com },
    saved: false,
    userComments: [
      {
        id: 1,
        userPic: {
          uri: "https://images.unsplash.com/photo-1604068105030-06d82bb48fd1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
        },
        userName: "Rajesh Naidu",
        userComment: "I really enjoyed learning from your content.",
        commentTimeStamp: "just now",
      },
      {
        id: 2,
        userPic: {
          uri: "https://images.unsplash.com/photo-1628577478162-d4d00467c627?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        },
        userName: "Chris Van Rensburg",
        userComment:
          "What would be the best way to learn about diesel mechanics quickly?",
        commentTimeStamp: "10 mins ago",
      },
      {
        id: 3,
        userPic: {
          uri: "https://images.unsplash.com/photo-1532601026355-709a58040664?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
        },
        userName: "Kevin Van Tonder",
        userComment:
          "I had to just say this, but bro the content you keep sharing is just top notch.",
        commentTimeStamp: "13 hours ago",
      },
    ],
  },
  {
    id: 2,
    isVideo: true,
    video: {
      uri: "https://player.vimeo.com/external/424465090.sd.mp4?s=ecc6244a6ed47e3de9018618a89ded9e6ccacdce&profile_id=165&oauth2_token_id=57447761",
    },
    userTitle: "Nancy Lewis",
    userProfileName: "Biologist",
    isFollow: false,
    totalVideos: 5,
    videoChannel: "The Environment",
    blurb:
      "Dedicated biological researcher with more than 4 years of experience using molecular biology techniques including sample preparation and sequencing. Looking to leverage mastery of biolyzers and electron microscopes in biological research at Qyl Inc.",
    userAccountImage: { uri: images.Simphiwe },
    videoName: "How to take of your plants",
    description:
      "As this happens, ecosystems and the essential natural assets they provide will come under threat. During this time of expansion and innovation, it is imperative that natural spaces are both protected and incorporated into urban landscapes.",
    commentCount: 3,
    appreciationCount: "1.5k",
    shareCount: 500,
    isAppreciated: false,
    viewerImage: { uri: images.com },
    saved: false,
    userComments: [
      {
        id: 1,
        userPic: {
          uri: "https://images.unsplash.com/photo-1621786040662-455f23dcb6ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
        },
        userName: "Nicole Rodgers",
        userComment: "Thank you for sharing this video with us",
        commentTimeStamp: "5 mins ago",
      },
      {
        id: 2,
        userPic: {
          uri: "https://images.unsplash.com/photo-1543764477-646365e11da3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=676&q=80",
        },
        userName: "Andy Compton",
        userComment:
          "I really enjoy reading your content, thanks for always educating us.",
        commentTimeStamp: "30 mins ago",
      },
      {
        id: 3,
        userPic: {
          uri: "https://images.unsplash.com/photo-1589502999130-19f36032d989?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
        },
        userName: "Jessica Van Der Merwe",
        userComment: "I love your content, please keep sharing.",
        commentTimeStamp: "5 hours ago",
      },
    ],
  },
];

//suggested how-to channel videos
export const suggestedHowToChannelData = [
  {
    id: 1,
    channelImage: {
      uri: "https://images.pexels.com/photos/2039938/pexels-photo-2039938.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
    channelName: "Sport & Recreation",
  },
  {
    id: 2,
    channelImage: {
      uri: "https://images.pexels.com/photos/127905/pexels-photo-127905.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
    channelName: "Travel & Hospitality",
  },
  {
    id: 3,
    channelImage: {
      uri: "https://images.pexels.com/photos/1833349/pexels-photo-1833349.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
    channelName: "Food & Beverage",
  },
  {
    id: 4,
    channelImage: {
      uri: "https://images.pexels.com/photos/2007647/pexels-photo-2007647.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
    channelName: "Science & Technology",
  },
  {
    id: 5,
    channelImage: {
      uri: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
    channelName: "Music & Entertainment",
  },
  {
    id: 6,
    channelImage: {
      uri: "https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
    channelName: "Business",
  },
  {
    id: 7,
    channelImage: { uri: images.cat17 },
    channelName: "Other",
  },
];

//suggested how-to videos because you watched
export const recommendedHowToVideosData = [
  {
    id: 1,
    channelImage: {
      uri: "https://images.unsplash.com/photo-1655834648155-f7a98ff3c49d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    },
    recommendationName: "How to use photoshop",
  },
  {
    id: 2,
    channelImage: {
      uri: "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/cb453b54866417.596d25d674815.gif",
    },
    recommendationName: "How to edit a effects to a still image",
  },
  {
    id: 3,
    channelImage: {
      uri: "https://images.unsplash.com/photo-1626328473821-47cf23331417?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80",
    },
    recommendationName: "How to use a 4K Ultra HD camera",
  },
  {
    id: 4,
    channelImage: {
      uri: "https://images.unsplash.com/photo-1586433877630-a92748c4f7e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=879&q=80",
    },
    recommendationName: "Which items do you need to setup your studio",
  },
];

//suggested thoughts channel videos
export const suggestedThoughtChannelData = [
  {
    id: 1,
    channelImage: {
      uri: "https://images.unsplash.com/photo-1512861506260-6520871bbdaa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    },
    channelName: "Engineering",
  },
  {
    id: 2,
    channelImage: {
      uri: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    },
    channelName: "Food & Beverage",
  },
  {
    id: 3,
    channelImage: {
      uri: "https://images.unsplash.com/photo-1513001900722-370f803f498d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
    },
    channelName: "Business",
  },
  {
    id: 4,
    channelImage: {
      uri: "https://images.unsplash.com/photo-1562408590-e32931084e23?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    },
    channelName: "Science & Technology",
  },
  {
    id: 5,
    channelImage: {
      uri: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    },
    channelName: "Music & Entertainment",
  },
  {
    id: 6,
    channelImage: {
      uri: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    },
    channelName: "Law & Politics",
  },
  {
    id: 7,
    channelImage: {
      uri: "https://images.unsplash.com/photo-1577897113292-3b95936e5206?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1090&q=80",
    },
    channelName: "Kids & Family",
  },
];

//suggested thoughts videos because you watched
export const recommendedThoughtsVideosData = [
  {
    id: 1,
    channelImage: {
      uri: "https://images.unsplash.com/photo-1554355605-533e0b93e299?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    },
    recommendationName: "The laws of human nature",
  },
  {
    id: 2,
    channelImage: {
      uri: "https://images.unsplash.com/photo-1638177591082-ae4c42755d92?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=755&q=80",
    },
    recommendationName: "How to win friend and influence people",
  },
  {
    id: 3,
    channelImage: {
      uri: "https://images.unsplash.com/photo-1607988795691-3d0147b43231?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    },
    recommendationName: "The art of thinking",
  },
  {
    id: 4,
    channelImage: {
      uri: "https://images.unsplash.com/photo-1501770118606-b1d640526693?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    },
    recommendationName: "Mind of a strategist",
  },
  {
    id: 5,
    channelImage: {
      uri: "https://images.unsplash.com/photo-1474631245212-32dc3c8310c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1024&q=80",
    },
    recommendationName: "How to always win and lead",
  },
];
