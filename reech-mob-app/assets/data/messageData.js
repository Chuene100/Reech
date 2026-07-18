import { images } from "../../constants";

//main message data
export const mainMessageDataList = [
  {
    id: 1,
    verified: true,
    profilePic: images.cc,
    username: "Comedy Central",
    message: "Your application was successfully sent.",
    sentTimestamp: "27 Jun",
    action: "MainMessageFullViewScreen",
  },
  {
    id: 2,
    verified: false,
    profilePic: images.Simon,
    username: "Richardo Mudra",
    message: "How about we raincheck for tomorrow afternoon?",
    sentTimestamp: "26 Jun",
    action: "MainMessageFullViewScreen",
  },
  {
    id: 3,
    verified: true,
    profilePic: images.gv,
    username: "Golden Valley",
    message:
      "We have received your concerns. One of our team members will be in touch with you ASAP.",
    sentTimestamp: "24 Jun",
    action: "MainMessageFullViewScreen",
  },
  {
    id: 4,
    verified: false,
    profilePic: images.Pm,
    username: "Thabang Mfene",
    message: "I am free tomorrow for a meet up around 12h00.",
    sentTimestamp: "21 Jun",
    action: "MainMessageFullViewScreen",
  },
  {
    id: 5,
    verified: false,
    profilePic: images.Michael,
    username: "Craven Smith",
    message: "I will see what I can do for you tomorrow",
    sentTimestamp: "3 Jun",
    action: "MainMessageFullViewScreen",
  },
  {
    id: 6,
    verified: true,
    profilePic: images.mtn,
    username: "MTN Telecom Group",
    message: "We have received you application. We will be in touch shortly.",
    sentTimestamp: "30 May",
    action: "MainMessageFullViewScreen",
  },
];

//notification data
export const notificationMessageData = [
  {
    id: 1,
    profilePic: images.Sam,
    username: "Lesedi Seloane",
    message: "Commented on your experience",
    sentTimestamp: "27 Jun",
    action: "SupportMessageFullViewScreen",
    noteType: "comment",
  },
  {
    id: 2,
    profilePic: images.sup5,
    username: "Brandon Long",
    message: "Shared your opportunity card.",
    sentTimestamp: "26 Jun",
    action: "SupportMessageFullViewScreen",
    noteType: "share",
  },
  {
    id: 3,
    profilePic: images.Julian,
    username: "Morty Smith",
    message: "Appreciated your bubble card.",
    sentTimestamp: "12 Jun",
    action: "SupportMessageFullViewScreen",
    noteType: "appreciate",
  },
  {
    id: 4,
    profilePic: images.Pm,
    username: "Tlakanelo Mbuso",
    message: "Sent you a bubble request",
    sentTimestamp: "13 Jun",
    action: "SupportMessageFullViewScreen",
    noteType: "request",
  },
  {
    id: 5,
    profilePic: images.Michael,
    username: "Thandi Modise",
    message: "Vouched for you",
    sentTimestamp: "8 Jun",
    action: "SupportMessageFullViewScreen",
    noteType: "vouch",
  },
  {
    id: 6,
    profilePic: images.Julian,
    username: "Morty Smith",
    message: "Appreciated your bubble card.",
    sentTimestamp: "5 Jun",
    action: "SupportMessageFullViewScreen",
    noteType: "appreciate",
  },
];

//support data
export const supportMessageCollectionItems = [
  {
    id: 1,
    bot: true,
    profilePic: images.reechieChat,
    username: "Reechie Bot",
    message: "Is there anything else you would like me to assist you with?",
    sentTimestamp: "27 Jun",
    action: "SupportMessageFullViewScreen",
  },
  {
    id: 2,
    bot: false,
    profilePic: "https://images.unsplash.com/photo-1655249481446-25d575f1c054?auto=format&fit=crop&q=80&w=987&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    username: "Rebecca from Reech",
    message:
      "Please note that I have sent you an OTP, please enter it and get back to me once done.",
    sentTimestamp: "27 Jun",
    action: "SupportMessageFullViewScreen",
  },
];

export const chatRoomData = [
  {
    id: 1,
    name: 'Thabang Mfene',
    verified: true,
    private: true,
    avatar: 'images.life1',
    messages: [
      {
        id: 1,
        text: 'Hello Thabang.',
        time: '00:00',
        read: false
      },
      {
        id: 2,
        text: 'Can we meet today?',
        time: '09:30',
        read: false
      }
    ],
  },
  {
    id: 2,
    name: 'Richardo Mudre',
    verified: false,
    private: true,
    avatar: 'images.life2',
    messages: [
      {
        id: 3,
        text: 'Hi there, Richardo!',
        time: '12:00',
        read: false
      },
    ],
  },
  {
    id: 3,
    name: 'Craven Smith',
    verified: false,
    private: true,
    avatar: 'images.life3',
    messages: [
      {
        id: 4,
        text: 'I will see what I can do for you tomorrow',
        time: '15:45',
        read: false
      },
    ],
  },
  {
    id: 4,
    name: 'Simba Moyo',
    verified: true,
    private: true,
    avatar: 'images.life4',
    messages: [
      {
        id: 5,
        text: 'Call me in an hour.',
        time: '21:45',
        read: false
      },
    ],
  },
]