{
  /* Generated from: https://www.termsandconditionsgenerator.com/live.php?token=V63MsPh222Ub8XdMEtiw6icJ6HfEB1kG */
}

import React, { useRef } from "react";
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import Unorderedlist from "react-native-unordered-list";

//import custom dependencies
import { COLORS } from "../../../constants";
import NavHeader from "@/components/Headers/NavHeader";

const TermsScreen = () => {
  const scrollRef = useRef();
  const navigation = useNavigation();

  const scrollToTopFunction = () => {
    scrollRef.current?.scrollTo({
      y: 0,
      animate: true,
    });
  };

  const goToPolicyScreen = () => {
    navigation.navigate("PolicyScreen");
  };


  //header section
  function renderHeaderSection() {
    return (
      <View style={styles.headerTermsComponentContainer}>
        <NavHeader />

        <View style={styles.screenHeaderTitleContainer}>
          <Text style={styles.screenHeaderTitleItem}>Terms and Conditions</Text>
          <Text style={styles.screenHeaderSubTitleItem}>Last updated:
            <Text style={styles.termsTopTextBoldItem}> July 05, 2022</Text>
          </Text>
        </View>
      </View>
    )
  }

  //terms content section
  function renderTermsContentSection() {
    return (
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}>
        <View style={styles.termsMainTopTextContent}>
          {/*top section text*/}
          <View style={styles.termsTopTextContainer}>
            <Text style={styles.termsTopTextItem}>
              These terms and conditions outline the rules and regulations for the
              use of Reecheble's Reecheble app, located at reecheble.com.
            </Text>
            <Text style={styles.termsTopTextItem}>
              By accessing this Reecheble app we assume you accept these terms and
              conditions. Do not continue to use Reech if you do not agree to take
              all of the terms and conditions stated on this page.
            </Text>
            <Text style={styles.termsTopTextItem}>
              The following terminology applies to these Terms and Conditions,
              Privacy Statement and Disclaimer Notice and all Agreements:
              "Client", "You" and "Your" refers to you, the person log on this
              Reecheble app and compliant to the Company’s terms and conditions.
              "The Company", "Ourselves", "We", "Our" and "Us", refers to our
              Company. "Party", "Parties", or "Us", refers to both the Client and
              ourselves.
            </Text>
            <Text style={styles.termsTopTextItem}>
              All terms refer to the offer, acceptance and consideration of
              payment necessary to undertake the process of our assistance to the
              Client in the most appropriate manner for the express purpose of
              meeting the Client’s needs in respect of provision of the Company’s
              stated services, in accordance with and subject to, prevailing law
              of Netherlands. Any use of the above terminology or other words in
              the singular, plural, capitalization and/or he/she or they, are
              taken as interchangeable and therefore as referring to same.
            </Text>
          </View>

          {/*cookies section*/}
          <View style={styles.termsTopTextContainer}>
            {/*sub title section*/}
            <View style={styles.termsSubHeadingTextContainer}>
              <Text style={styles.termsSubHeadingTextItem}>Cookies</Text>
            </View>

            <Text style={styles.termsTopTextItem}>
              We employ the use of cookies. By accessing Reech, you agreed to use
              cookies in agreement with the Reecheble's Privacy Policy.
            </Text>
            <Text style={styles.termsTopTextItem}>
              Most interactive Reecheble apps use cookies to let us retrieve the
              user’s details for each visit. Cookies are used by our Reecheble app
              to enable the functionality of certain areas to make it easier for
              people visiting our Reecheble app. Some of our affiliate/advertising
              partners may also use cookies.
            </Text>
          </View>

          {/*license section*/}
          <View style={styles.termsTopTextContainer}>
            {/*sub title section*/}
            <View style={styles.termsSubHeadingTextContainer}>
              <Text style={styles.termsSubHeadingTextItem}>License</Text>
            </View>

            <Text style={styles.termsTopTextItem}>
              Unless otherwise stated, Reecheble and/or its licensors own the
              intellectual property rights for all material on Reech. All
              intellectual property rights are reserved. You may access this from
              Reech for your own personal use subjected to restrictions set in
              these terms and conditions.
            </Text>

            <Text style={styles.termsTopTextBoldItem}>You must not:</Text>
            {/*list items*/}
            <View style={styles.termsListItemsContainer}>
              <Unorderedlist bulletUnicode={0x2022} color={COLORS.white}>
                <Text style={styles.termsTopTextItem}>Republish material from Reech</Text>
              </Unorderedlist>
              <Unorderedlist bulletUnicode={0x2022} color={COLORS.white}>
                <Text style={styles.termsTopTextItem}>Sell, rent or sub-license material from Reech</Text>
              </Unorderedlist>
              <Unorderedlist bulletUnicode={0x2022} color={COLORS.white}>
                <Text style={styles.termsTopTextItem}>Reproduce, duplicate or copy material from Reech</Text>
              </Unorderedlist>
              <Unorderedlist bulletUnicode={0x2022} color={COLORS.white}>
                <Text style={styles.termsTopTextItem}>Redistribute content from Reech</Text>
              </Unorderedlist>
            </View>

            <Text style={styles.termsTopTextItem}>
              This Agreement shall begin on the date hereof.
            </Text>

            <Text style={styles.termsTopTextItem}>
              Parts of this Reecheble app offer an opportunity for users to post
              and exchange opinions and information in certain areas of the
              Reecheble app. Reecheble does not filter, edit, publish or review
              Comments prior to their presence on the Reecheble app. Comments do
              not reflect the views and opinions of Reecheble,its agents and/or
              affiliates. Comments reflect the views and opinions of the person
              who post their views and opinions. To the extent permitted by
              applicable laws, Reecheble shall not be liable for the Comments or
              for any liability, damages or expenses caused and/or suffered as a
              result of any use of and/or posting of and/or appearance of the
              Comments on this Reecheble app.
            </Text>

            <Text style={styles.termsTopTextItem}>
              Reecheble reserves the right to monitor all Comments and to remove
              any Comments which can be considered inappropriate, offensive or
              causes breach of these Terms and Conditions.
            </Text>

            <Text style={styles.termsTopTextBoldItem}>
              You warrant and represent that:
            </Text>

            {/*list items*/}
            <View style={styles.termsListItemsContainer}>
              <Unorderedlist bulletUnicode={0x2022} color={COLORS.white}>
                <Text style={styles.termsTopTextItem}>
                  You are entitled to post the Comments on our Reecheble app and
                  have all necessary licenses and consents to do so.
                </Text>
              </Unorderedlist>
              <Unorderedlist bulletUnicode={0x2022} color={COLORS.white}>
                <Text style={styles.termsTopTextItem}>
                  The Comments do not invade any intellectual property right,
                  including without limitation copyright, patent or trademark of any
                  third party.
                </Text>
              </Unorderedlist>
              <Unorderedlist bulletUnicode={0x2022} color={COLORS.white}>
                <Text style={styles.termsTopTextItem}>
                  The Comments do not contain any defamatory, libelous, offensive,
                  indecent or otherwise unlawful material which is an invasion of
                  privacy.
                </Text>
              </Unorderedlist>
              <Unorderedlist bulletUnicode={0x2022} color={COLORS.white}>
                <Text style={styles.termsTopTextItem}>
                  You hereby grant Reecheble a non-exclusive license to use,
                  reproduce, edit and authorize others to use, reproduce and edit any
                  of your Comments in any and all forms, formats or media.
                </Text>
              </Unorderedlist>
            </View>
          </View>

          {/*hyperlink section*/}
          <View style={styles.termsTopTextContainer}>
            {/*sub title section*/}
            <View style={styles.termsSubHeadingTextContainer}>
              <Text style={styles.termsSubHeadingTextItem}>Hyperlinking to our Content</Text>
            </View>

            <Text style={styles.termsTopTextBoldItem}>
              The following organizations may link to our Reecheble app without
              prior written approval:
            </Text>

            {/*list items*/}
            <View style={styles.termsListItemsContainer}>
              <Unorderedlist bulletUnicode={0x2022} color={COLORS.white}>
                <Text style={styles.termsTopTextItem}>Government agencies</Text>
              </Unorderedlist>
              <Unorderedlist bulletUnicode={0x2022} color={COLORS.white}>
                <Text style={styles.termsTopTextItem}>Search engines</Text>
              </Unorderedlist>
              <Unorderedlist bulletUnicode={0x2022} color={COLORS.white}>
                <Text style={styles.termsTopTextItem}>News organizations</Text>
              </Unorderedlist>
              <Unorderedlist bulletUnicode={0x2022} color={COLORS.white}>
                <Text style={styles.termsTopTextItem}>
                  Online directory distributors may link to our Reecheble app in the
                  same manner as they hyperlink to the website of other listed
                  businesses; and
                </Text>
              </Unorderedlist>
              <Unorderedlist bulletUnicode={0x2022} color={COLORS.white}>
                <Text style={styles.termsTopTextItem}>
                  System wide Accredited Businesses except soliciting non-profit
                  organizations, charity shopping malls, and charity fundraising
                  groups which may not hyperlink to our Web site.
                </Text>
              </Unorderedlist>
              <Unorderedlist bulletUnicode={0x2022} color={COLORS.white}>
                <Text style={styles.termsTopTextItem}>
                  These organizations may link to our home page, to publications or to
                  other Reecheble app information so long as the link: (a) is not in
                  any way deceptive; (b) does not falsely imply sponsorship,
                  endorsement or approval of the linking party and its products and/or
                  services; and (c) fits within the context of the linking party's
                  site.
                </Text>
              </Unorderedlist>
            </View>

            <Text style={styles.termsTopTextBoldItem}>
              We may consider and approve other link requests from the following
              types of organizations:
            </Text>

            {/*list items*/}
            <View style={styles.termsListItemsContainer}>
              <Unorderedlist bulletUnicode={0x2022} color={COLORS.white}>
                <Text style={styles.termsTopTextItem}>
                  commonly-known consumer and/or business information sources.
                </Text>
              </Unorderedlist>
              <Unorderedlist bulletUnicode={0x2022} color={COLORS.white}>
                <Text style={styles.termsTopTextItem}>
                  dot.com community sites.
                </Text>
              </Unorderedlist>
              <Unorderedlist bulletUnicode={0x2022} color={COLORS.white}>
                <Text style={styles.termsTopTextItem}>
                  online directory distributors.
                </Text>
              </Unorderedlist>
              <Unorderedlist bulletUnicode={0x2022} color={COLORS.white}>
                <Text style={styles.termsTopTextItem}>
                  internet portals
                </Text>
              </Unorderedlist>
              <Unorderedlist bulletUnicode={0x2022} color={COLORS.white}>
                <Text style={styles.termsTopTextItem}>
                  accounting, law and consulting firms; and
                </Text>
              </Unorderedlist>
              <Unorderedlist bulletUnicode={0x2022} color={COLORS.white}>
                <Text style={styles.termsTopTextItem}>
                  educational institutions and trade associations.
                </Text>
              </Unorderedlist>
            </View>

            <Text style={styles.termsTopTextItem}>
              We will approve link requests from these organizations if we decide
              that: (a) the link would not make us look unfavorably to ourselves
              or to our accredited businesses; (b) the organization does not have
              any negative records with us; (c) the benefit to us from the
              visibility of the hyperlink compensates the absence of Reecheble;
              and (d) the link is in the context of general resource information.
            </Text>

            <Text style={styles.termsTopTextItem}>
              These organizations may link to our home page so long as the link:
              (a) is not in any way deceptive; (b) does not falsely imply
              sponsorship, endorsement or approval of the linking party and its
              products or services; and (c) fits within the context of the linking
              party’s site.
            </Text>

            <Text style={styles.termsTopTextItem}>
              If you are one of the organizations listed in paragraph 2 above and
              are interested in linking to our Reecheble app, you must inform us
              by sending an e-mail to Reecheble. Please include your name, your
              organization name, contact information as well as the URL of your
              site, a list of any URLs from which you intend to link to our
              Reecheble app, and a list of the URLs on our site to which you would
              like to link. Wait 2-3 weeks for a response.
            </Text>

            <Text style={styles.termsTopTextBoldItem}>
              Approved organizations may hyperlink to our Reecheble app as
              follows:
            </Text>

            {/*list items*/}
            <View style={styles.termsListItemsContainer}>
              <Unorderedlist bulletUnicode={0x2022} color={COLORS.white}>
                <Text style={styles.termsTopTextItem}>
                  By use of our corporate name; or
                </Text>
              </Unorderedlist>
              <Unorderedlist bulletUnicode={0x2022} color={COLORS.white}>
                <Text style={styles.termsTopTextItem}>
                  By use of the uniform resource locator being linked to; or
                </Text>
              </Unorderedlist>
              <Unorderedlist bulletUnicode={0x2022} color={COLORS.white}>
                <Text style={styles.termsTopTextItem}>
                  By use of any other description of our Reecheble app being linked
                  to that makes sense within the context and format of content on
                  the linking party’s site.
                </Text>
              </Unorderedlist>
              <Unorderedlist bulletUnicode={0x2022} color={COLORS.white}>
                <Text style={styles.termsTopTextItem}>
                  No use of Reecheble's logo or other artwork will be allowed for
                  linking absent a trademark license agreement.
                </Text>
              </Unorderedlist>
            </View>
          </View>

          {/*iFrame section*/}
          <View style={styles.termsTopTextContainer}>
            {/*sub title section*/}
            <View style={styles.termsSubHeadingTextContainer}>
              <Text style={styles.termsSubHeadingTextItem}>iFrames</Text>
            </View>

            <Text style={styles.termsTopTextItem}>
              Without prior approval and written permission, you may not create
              frames around our Webpages that alter in any way the visual
              presentation or appearance of our Reecheble app.
            </Text>
          </View>

          {/*privacy section*/}
          <View style={styles.termsTopTextContainer}>
            {/*sub title section*/}
            <View style={styles.termsSubHeadingTextContainer}>
              <Text style={styles.termsSubHeadingTextItem}>Your Privacy</Text>
            </View>

            <Text style={styles.termsTopTextItem}>
              Please read{" "}
              <Text onPress={goToPolicyScreen} style={styles.termsTopTextLinkItem}>
                Privacy Policy
              </Text>
            </Text>
          </View>

          {/*reservation section*/}
          <View style={styles.termsTopTextContainer}>
            {/*sub title section*/}
            <View style={styles.termsSubHeadingTextContainer}>
              <Text style={styles.termsSubHeadingTextItem}>Removal of links from our Reecheble app</Text>
            </View>

            <Text style={styles.termsTopTextItem}>
              If you find any link on our Reecheble app that is offensive for any
              reason, you are free to contact and inform us any moment. We will
              consider requests to remove links but we are not obligated to or so
              or to respond to you directly.
            </Text>
            <Text style={styles.termsTopTextItem}>
              We do not ensure that the information on this Reecheble app is
              correct, we do not warrant its completeness or accuracy; nor do we
              promise to ensure that the Reecheble app remains available or that
              the material on the Reecheble app is kept up to date.
            </Text>
          </View>

          {/*disclaimer section*/}
          <View style={styles.termsTopTextContainer}>
            {/*sub title section*/}
            <View style={styles.termsSubHeadingTextContainer}>
              <Text style={styles.termsSubHeadingTextItem}>Disclaimer</Text>
            </View>

            <Text style={styles.termsTopTextBoldItem}>
              To the maximum extent permitted by applicable law, we exclude all
              representations, warranties and conditions relating to our Reecheble
              app and the use of this Reecheble app. Nothing in this disclaimer
              will:
            </Text>

            {/*list items*/}
            <View style={styles.termsListItemsContainer}>
              <Unorderedlist bulletUnicode={0x2022} color={COLORS.white}>
                <Text style={styles.termsTopTextItem}>
                  limit or exclude our or your liability for death or personal
                  injury;
                </Text>
              </Unorderedlist>
              <Unorderedlist bulletUnicode={0x2022} color={COLORS.white}>
                <Text style={styles.termsTopTextItem}>
                  limit or exclude our or your liability for fraud or fraudulent
                  misrepresentation;
                </Text>
              </Unorderedlist>
              <Unorderedlist bulletUnicode={0x2022} color={COLORS.white}>
                <Text style={styles.termsTopTextItem}>
                  limit any of our or your liabilities in any way that is not
                  permitted under applicable law; or
                </Text>
              </Unorderedlist>
              <Unorderedlist bulletUnicode={0x2022} color={COLORS.white}>
                <Text style={styles.termsTopTextItem}>
                  exclude any of our or your liabilities that may not be excluded
                  under applicable law.
                </Text>
              </Unorderedlist>
            </View>

            <Text style={styles.termsTopTextItem}>
              The limitations and prohibitions of liability set in this Section
              and elsewhere in this disclaimer: (a) are subject to the preceding
              paragraph; and (b) govern all liabilities arising under the
              disclaimer, including liabilities arising in contract, in tort and
              for breach of statutory duty.
            </Text>

            <Text style={styles.termsTopTextItem}>
              As long as the Reecheble app and the information and services on the
              Reecheble app are provided free of charge, we will not be liable for
              any loss or damage of any nature.
            </Text>
          </View>
        </View>
      </ScrollView>
    )
  }

  //screen scroller section
  function renderScreenScrollerSection() {
    return (
      <View style={styles.screenScrollerContainer}>
        <TouchableOpacity
          onPress={scrollToTopFunction}
          style={styles.scrollerContent}>
          <AntDesign name="upcircle" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.termContainer}>
      {renderHeaderSection()}
      {renderTermsContentSection()}
      {renderScreenScrollerSection()}
    </View>
  );
};

const styles = StyleSheet.create({
  termContainer: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  headerTermsComponentContainer: {
    marginTop: Platform.OS === "ios" ? "10%" : 0,
  },
  screenHeaderTitleContainer: {
    marginTop: 15,
    paddingHorizontal: 15,
    justifyContent: "center",
    alignItems: "flex-start",
    flexDirection: "column",
    marginBottom: 10,
  },
  screenHeaderTitleItem: {
    color: COLORS.teal,
    fontSize: 26,
    fontFamily: "PoppinsBold",
  },
  screenHeaderSubTitleItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight"
  },

  //main terms content
  termsMainTopTextContent: {
    marginTop: 10,
    paddingHorizontal: 15,
    marginBottom: Platform.OS === "ios" ? 80 : 0,
  },
  termsTopTextContainer: {
    flexDirection: "column"
  },
  termsTopTextItem: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
    marginBottom: 10,
  },
  termsTopTextBoldItem: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsBold",
    marginBottom: 10,
  },
  termsTopTextLinkItem: {
    color: COLORS.lightBlue,
    fontSize: 12,
    fontFamily: "PoppinsBold",
  },
  termsSubHeadingTextContainer: {
    marginVertical: 5,
  },
  termsSubHeadingTextItem: {
    color: COLORS.teal,
    fontSize: 24,
    fontFamily: "PoppinsBold",
  },
  termsListItemsContainer: {
    paddingHorizontal: 10,
    flexDirection: "column",
  },

  //screen scroller section
  screenScrollerContainer: {
    top: Platform.OS === "ios" ? -50 : 0,
    marginTop: Platform.OS === "ios" ? -50 : 10,
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  scrollerContent: {
    width: 40,
    height: 40,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.purpleDark,
  },
});

export default TermsScreen;
