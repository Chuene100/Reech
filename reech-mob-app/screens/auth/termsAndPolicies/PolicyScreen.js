{
  /* Generated from: https://www.privacypolicies.com/live/8c900d28-e7a9-482b-b463-8f522965c76b */
}

import React, { useRef } from "react";
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Platform } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import Unorderedlist from "react-native-unordered-list";

//import custom dependencies
import { COLORS } from "../../../constants";
import NavHeader from "@/components/Headers/NavHeader";

const PolicyScreen = () => {
  const scrollRef = useRef();

  const scrollToTopFunction = () => {
    scrollRef.current?.scrollTo({
      y: 0,
      animate: true,
    });
  };

  //header section
  function renderHeaderSection() {
    return (
      <View style={styles.privacyHeaderTermsComponentContainer}>
        <NavHeader />

        <View style={styles.privacyScreenHeaderTitleContainer}>
          <Text style={styles.privacyScreenHeaderTitleItem}>Privacy Policy</Text>
          <Text style={styles.privacyScreenHeaderSubTitleItem}>Last updated:
            <Text style={styles.privacyTopTextBoldItem}> July 05, 2022</Text>
          </Text>
        </View>
      </View>
    )
  }

  //privacy content section
  function renderTermsContentSection() {
    return (
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}>
        <View style={styles.privacyMainTopTextContent}>
          {/*top section text*/}
          <View style={styles.privacyTopTextContainer}>
            <Text style={styles.privacyTopTextItem}>
              This Privacy Policy describes Our policies and procedures on the
              collection, use and disclosure of Your information when You use the
              Service and tells You about Your privacy rights and how the law
              protects You.
            </Text>
            <Text style={styles.privacyTopTextItem}>
              We use Your Personal data to provide and improve the Service. By
              using the Service, You agree to the collection and use of
              information in accordance with this Privacy Policy.
            </Text>
          </View>

          {/*interpretation and definitions section*/}
          <View style={styles.privacyTopTextContainer}>
            {/*sub title section*/}
            <View style={styles.privacySubHeadingTextContainer}>
              <Text style={styles.privacySubHeadingTextItem}>Interpretation and Definitions</Text>
            </View>

            <Text style={styles.privacyTopTextBoldItem}>
              Interpretation:
            </Text>
            <Text style={styles.privacyTopTextItem}>
              The words of which the initial letter is capitalized have meanings
              defined under the following conditions. The following definitions
              shall have the same meaning regardless of whether they appear in
              singular or in plural.
            </Text>
            <Text style={styles.privacyTopTextBoldItem}>
              Definitions:
            </Text>
            <Text style={styles.privacyTopTextItem}>
              For the purposes of this Privacy Policy:
            </Text>
            {/*list items*/}
            <View style={styles.privacyListItemsContainer}>
              <Unorderedlist bulletUnicode={0x2022} color={COLORS.white}>
                <Text style={styles.privacyTopTextItem}>
                  <Text style={styles.privacyTopTextBoldItem}>
                    Account
                  </Text> means a unique account created for You to access our Service or parts of
                  our Service.
                </Text>
              </Unorderedlist>
              <Unorderedlist bulletUnicode={0x2022} color={COLORS.white}>
                <Text style={styles.privacyTopTextItem}>
                  <Text style={styles.privacyTopTextBoldItem}>
                    Affiliate
                  </Text> means an entity that controls, is controlled by or is under common
                  control with a party, where "control" means ownership of 50% or
                  more of the shares, equity interest or other securities entitled
                  to vote for election of directors or other managing authority.
                </Text>
              </Unorderedlist>
              <Unorderedlist bulletUnicode={0x2022} color={COLORS.white}>
                <Text style={styles.privacyTopTextItem}>
                  <Text style={styles.privacyTopTextBoldItem}>
                    Application
                  </Text> means the software program provided by the Company downloaded by You on
                  any electronic device, named Reech
                </Text>
              </Unorderedlist>
              <Unorderedlist bulletUnicode={0x2022} color={COLORS.white}>
                <Text style={styles.privacyTopTextItem}>
                  <Text style={styles.privacyTopTextBoldItem}>
                    Company
                  </Text> (referred to as either "the Company", "We", "Us" or "Our" in this Agreement)
                  refers to Reecheble, 45 Munyaka Estate, 1 Mia Drive, Waterfall
                  City, Midrand, Gauteng 2090.
                </Text>
              </Unorderedlist>
              <Unorderedlist bulletUnicode={0x2022} color={COLORS.white}>
                <Text style={styles.privacyTopTextItem}>
                  <Text style={styles.privacyTopTextBoldItem}>
                    Device
                  </Text> means any device that can access the Service such as a computer, a
                  cellphone or a digital tablet.
                </Text>
              </Unorderedlist>
              <Unorderedlist bulletUnicode={0x2022} color={COLORS.white}>
                <Text style={styles.privacyTopTextItem}>
                  <Text style={styles.privacyTopTextBoldItem}>
                    Personal Data
                  </Text> is any information that relates to an identified or identifiable
                  individual.
                </Text>
              </Unorderedlist>
              <Unorderedlist bulletUnicode={0x2022} color={COLORS.white}>
                <Text style={styles.privacyTopTextItem}>
                  <Text style={styles.privacyTopTextBoldItem}>
                    Service
                  </Text> refers to the Application.
                </Text>
              </Unorderedlist>
              <Unorderedlist bulletUnicode={0x2022} color={COLORS.white}>
                <Text style={styles.privacyTopTextItem}>
                  <Text style={styles.privacyTopTextBoldItem}>
                    Service Provider
                  </Text> means any natural or legal person who processes the data on
                  behalf of the Company. It refers to third-party companies or
                  individuals employed by the Company to facilitate the Service,
                  to provide the Service on behalf of the Company, to perform
                  services related to the Service or to assist the Company in
                  analyzing how the Service is used.
                </Text>
              </Unorderedlist>
              <Unorderedlist bulletUnicode={0x2022} color={COLORS.white}>
                <Text style={styles.privacyTopTextItem}>
                  <Text style={styles.privacyTopTextBoldItem}>
                    You
                  </Text> means the individual accessing or using the Service, or the company, or
                  other legal entity on behalf of which such individual is
                  accessing or using the Service, as applicable.
                </Text>
              </Unorderedlist>
            </View>
          </View>

          {/*data collection section*/}
          <View style={styles.privacyTopTextContainer}>
            {/*sub title section*/}
            <View style={styles.privacySubHeadingTextContainer}>
              <Text style={styles.privacySubHeadingTextItem}>Collecting and Using Your Personal Data</Text>
            </View>

            <Text style={styles.privacyTopTextBoldItem}>
              Types of Data Collected
            </Text>
            <Text style={styles.privacyTopTextBoldItem}>
              Personal Data
            </Text>

            <Text style={styles.privacyTopTextItem}>
              While using Our Service, We may ask You to provide Us with certain
              personally identifiable information that can be used to contact or
              identify You. Personally identifiable information may include, but
              is not limited to:
            </Text>

            {/*list items*/}
            <View style={styles.privacyListItemsContainer}>
              <Unorderedlist bulletUnicode={0x2022} color={COLORS.white}>
                <Text style={styles.privacyTopTextItem}>First name and last name</Text>
              </Unorderedlist>
              <Unorderedlist bulletUnicode={0x2022} color={COLORS.white}>
                <Text style={styles.privacyTopTextItem}>Email address</Text>
              </Unorderedlist>
              <Unorderedlist bulletUnicode={0x2022} color={COLORS.white}>
                <Text style={styles.privacyTopTextItem}>Identity number</Text>
              </Unorderedlist>
              <Unorderedlist bulletUnicode={0x2022} color={COLORS.white}>
                <Text style={styles.privacyTopTextItem}>Phone number</Text>
              </Unorderedlist>
              <Unorderedlist bulletUnicode={0x2022} color={COLORS.white}>
                <Text style={styles.privacyTopTextItem}>Address, State, Province, ZIP/Postal code, City</Text>
              </Unorderedlist>
              <Unorderedlist bulletUnicode={0x2022} color={COLORS.white}>
                <Text style={styles.privacyTopTextItem}>Job industry</Text>
              </Unorderedlist>
              <Unorderedlist bulletUnicode={0x2022} color={COLORS.white}>
                <Text style={styles.privacyTopTextItem}>Usage data</Text>
              </Unorderedlist>
            </View>
          </View>

          {/*data usage section*/}
          <View style={styles.privacyTopTextContainer}>
            {/*sub title section*/}
            <View style={styles.privacySubHeadingTextContainer}>
              <Text style={styles.privacySubHeadingTextItem}>Usage Data</Text>
            </View>

            <Text style={styles.privacyTopTextBoldItem}>
              Usage Data is collected automatically when using the Service.
            </Text>

            <Text style={styles.privacyTopTextItem}>
              Usage Data may include information such as Your Device's Internet
              Protocol address (e.g. IP address), browser type, browser version,
              the pages of our Service that You visit, the time and date of Your
              visit, the time spent on those pages, unique device identifiers and
              other diagnostic data.
            </Text>

            <Text style={styles.privacyTopTextItem}>
              When You access the Service by or through a mobile device, We may
              collect certain information automatically, including, but not
              limited to, the type of mobile device You use, Your mobile device
              unique ID, the IP address of Your mobile device, Your mobile
              operating system, the type of mobile Internet browser You use,
              unique device identifiers and other diagnostic data.
            </Text>

            <Text style={styles.privacyTopTextItem}>
              We may also collect information that Your browser sends whenever You
              visit our Service or when You access the Service by or through a
              mobile device.
            </Text>
          </View>

          {/*information section*/}
          <View style={styles.privacyTopTextContainer}>
            {/*sub title section*/}
            <View style={styles.privacySubHeadingTextContainer}>
              <Text style={styles.privacySubHeadingTextItem}>Information Collected while Using the Application</Text>
            </View>

            <Text style={styles.privacyTopTextBoldItem}>
              While using Our Application, in order to provide features of Our
              Application, We may collect, with Your prior permission:
            </Text>

            {/*list items*/}
            <View style={styles.privacyListItemsContainer}>
              <Unorderedlist bulletUnicode={0x2022} color={COLORS.white}>
                <Text style={styles.privacyTopTextItem}>
                  Information regarding your location
                </Text>
              </Unorderedlist>
              <Unorderedlist bulletUnicode={0x2022} color={COLORS.white}>
                <Text style={styles.privacyTopTextItem}>
                  Pictures and other information from your Device's camera and photo
                  library
                </Text>
              </Unorderedlist>
            </View>

            <Text style={styles.privacyTopTextItem}>
              We use this information to provide features of Our Service, to
              improve and customize Our Service. The information may be uploaded
              to the Company's servers and/or a Service Provider's server or it
              may be simply stored on Your device.
            </Text>

            <Text style={styles.privacyTopTextItem}>
              You can enable or disable access to this information at any time,
              through Your Device settings.
            </Text>
          </View>

          {/*personal use section*/}
          <View style={styles.privacyTopTextContainer}>
            {/*sub title section*/}
            <View style={styles.privacySubHeadingTextContainer}>
              <Text style={styles.privacySubHeadingTextItem}>
                Use of Your Personal Data
              </Text>
            </View>

            <Text style={styles.privacyTopTextBoldItem}>
              The Company may use Personal Data for the following purposes:
            </Text>

            {/*list items*/}
            <View style={styles.privacyListItemsContainer}>
              <Unorderedlist bulletUnicode={0x2022} color={COLORS.white}>
                <Text style={styles.privacyTopTextItem}>
                  <Text style={styles.privacyTopTextBoldItem}>
                    To provide and maintain our Service,
                  </Text> including to monitor the usage of our Service.
                </Text>
              </Unorderedlist>
              <Unorderedlist bulletUnicode={0x2022} color={COLORS.white}>
                <Text style={styles.privacyTopTextItem}>
                  <Text style={styles.privacyTopTextBoldItem}>
                    To manage Your Account:
                  </Text> to manage Your registration as a user of the Service. The Personal
                  Data You provide can give You access to different functionalities
                  of the Service that are available to You as a registered user.
                </Text>
              </Unorderedlist>
              <Unorderedlist bulletUnicode={0x2022} color={COLORS.white}>
                <Text style={styles.privacyTopTextItem}>
                  <Text style={styles.privacyTopTextBoldItem}>
                    For the performance of a contract:
                  </Text> the development, compliance and undertaking of the purchase
                  contract for the products, items or services You have purchased or
                  of any other contract with Us through the Service.
                </Text>
              </Unorderedlist>
              <Unorderedlist bulletUnicode={0x2022} color={COLORS.white}>
                <Text style={styles.privacyTopTextItem}>
                  <Text style={styles.privacyTopTextBoldItem}>
                    To contact You
                  </Text> by email, telephone calls, SMS, or other equivalent
                  forms of electronic communication, such as a mobile application's
                  push notifications regarding updates or informative communications
                  related to the functionalities, products or contracted services,
                  including the security updates, when necessary or reasonable for
                  their implementation.
                </Text>
              </Unorderedlist>
              <Unorderedlist bulletUnicode={0x2022} color={COLORS.white}>
                <Text style={styles.privacyTopTextItem}>
                  <Text style={styles.privacyTopTextBoldItem}>
                    Account
                  </Text> means a unique account created for You to access our Service or parts of our
                  Service.
                </Text>
              </Unorderedlist>
              <Unorderedlist bulletUnicode={0x2022} color={COLORS.white}>
                <Text style={styles.privacyTopTextItem}>
                  <Text style={styles.privacyTopTextBoldItem}>
                    To provide You
                  </Text> with news, special offers and general information about other goods,
                  services and events which we offer that are similar to those that
                  you have already purchased or enquired about unless You have opted
                  not to receive such information.
                </Text>
              </Unorderedlist>
              <Unorderedlist bulletUnicode={0x2022} color={COLORS.white}>
                <Text style={styles.privacyTopTextItem}>
                  <Text style={styles.privacyTopTextBoldItem}>
                    To manage Your requests:
                  </Text> To attend and manage Your requests to Us.
                </Text>
              </Unorderedlist>
              <Unorderedlist bulletUnicode={0x2022} color={COLORS.white}>
                <Text style={styles.privacyTopTextItem}>
                  <Text style={styles.privacyTopTextBoldItem}>
                    For business transfers:
                  </Text> We may use Your information to evaluate or conduct a merger,
                  divestiture, restructuring, reorganization, dissolution, or other
                  sale or transfer of some or all of Our assets, whether as a going
                  concern or as part of bankruptcy, liquidation, or similar
                  proceeding, in which Personal Data held by Us about our Service
                  users is among the assets transferred.
                </Text>
              </Unorderedlist>
              <Unorderedlist bulletUnicode={0x2022} color={COLORS.white}>
                <Text style={styles.privacyTopTextItem}>
                  <Text style={styles.privacyTopTextBoldItem}>
                    For other purposes
                  </Text> We may use Your information for other purposes, such as data
                  analysis, identifying usage trends, determining the effectiveness
                  of our promotional campaigns and to evaluate and improve our
                  Service, products, services, marketing and your experience.
                </Text>
              </Unorderedlist>
            </View>

            <Text style={styles.privacyTopTextBoldItem}>
              We may share Your personal information in the following situations:
            </Text>

            <Unorderedlist bulletUnicode={0x2022} color={COLORS.white}>
              <Text style={styles.privacyTopTextItem}>
                <Text style={styles.privacyTopTextBoldItem}>
                  With Service Providers:
                </Text> We may share Your personal information with Service Providers to
                monitor and analyze the use of our Service, to contact You.
              </Text>
            </Unorderedlist>
            <Unorderedlist bulletUnicode={0x2022} color={COLORS.white}>
              <Text style={styles.privacyTopTextItem}>
                <Text style={styles.privacyTopTextBoldItem}>
                  For business transfers
                </Text> We may share or transfer Your personal information in connection
                with, or during negotiations of, any merger, sale of Company
                assets, financing, or acquisition of all or a portion of Our
                business to another company.
              </Text>
            </Unorderedlist>
            <Unorderedlist bulletUnicode={0x2022} color={COLORS.white}>
              <Text style={styles.privacyTopTextItem}>
                <Text style={styles.privacyTopTextBoldItem}>
                  With Affiliates:
                </Text> We may share Your information with Our affiliates, in which case we will
                require those affiliates to honor this Privacy Policy. Affiliates
                include Our parent company and any other subsidiaries, joint
                venture partners or other companies that We control or that are
                under common control with Us.
              </Text>
            </Unorderedlist>
            <Unorderedlist bulletUnicode={0x2022} color={COLORS.white}>
              <Text style={styles.privacyTopTextItem}>
                <Text style={styles.privacyTopTextBoldItem}>
                  With business partners:
                </Text>  We may share Your information with Our business partners to offer
                You certain products, services or promotions.
              </Text>
            </Unorderedlist>
            <Unorderedlist bulletUnicode={0x2022} color={COLORS.white}>
              <Text style={styles.privacyTopTextItem}>
                <Text style={styles.privacyTopTextBoldItem}>
                  With other users:
                </Text> when You share personal information or otherwise interact in the public
                areas with other users, such information may be viewed by all
                users and may be publicly distributed outside.
              </Text>
            </Unorderedlist>
            <Unorderedlist bulletUnicode={0x2022} color={COLORS.white}>
              <Text style={styles.privacyTopTextItem}>
                <Text style={styles.privacyTopTextBoldItem}>
                  With Your consent
                </Text> We may disclose Your personal information for any other purpose with
                Your consent.
              </Text>
            </Unorderedlist>
          </View>

          {/*rentention of personal data section*/}
          <View style={styles.privacyTopTextContainer}>
            {/*sub title section*/}
            <View style={styles.privacySubHeadingTextContainer}>
              <Text style={styles.privacySubHeadingTextItem}>
                Retention of Your Personal Data
              </Text>
            </View>

            <Text style={styles.privacyTopTextItem}>
              The Company will retain Your Personal Data only for as long as is
              necessary for the purposes set out in this Privacy Policy. We will
              retain and use Your Personal Data to the extent necessary to comply
              with our legal obligations (for example, if we are required to
              retain your data to comply with applicable laws), resolve disputes,
              and enforce our legal agreements and policies.
            </Text>

            <Text style={styles.privacyTopTextItem}>
              The Company will retain Your Personal Data only for as long as is
              necessary for the purposes set out in this Privacy Policy. We will
              retain and use Your Personal Data to the extent necessary to comply
              with our legal obligations (for example, if we are required to
              retain your data to comply with applicable laws), resolve disputes,
              and enforce our legal agreements and policies.
            </Text>
          </View>

          {/*transfer section*/}
          <View style={styles.privacyTopTextContainer}>
            {/*sub title section*/}
            <View style={styles.privacySubHeadingTextContainer}>
              <Text style={styles.privacySubHeadingTextItem}>
                Transfer of Your Personal Data
              </Text>
            </View>

            <Text style={styles.privacyTopTextItem}>
              Your information, including Personal Data, is processed at the
              Company's operating offices and in any other places where the
              parties involved in the processing are located. It means that this
              information may be transferred to — and maintained on — computers
              located outside of Your state, province, country or other
              governmental jurisdiction where the data protection laws may differ
              than those from Your jurisdiction.
            </Text>

            <Text style={styles.privacyTopTextItem}>
              Your consent to this Privacy Policy followed by Your submission of
              such information represents Your agreement to that transfer.
            </Text>

            <Text style={styles.privacyTopTextItem}>
              The Company will take all steps reasonably necessary to ensure that
              Your data is treated securely and in accordance with this Privacy
              Policy and no transfer of Your Personal Data will take place to an
              organization or a country unless there are adequate controls in
              place including the security of Your data and other personal
              information.
            </Text>
          </View>

          {/*disclosure section*/}
          <View style={styles.privacyTopTextContainer}>
            {/*sub title section*/}
            <View style={styles.privacySubHeadingTextContainer}>
              <Text style={styles.privacySubHeadingTextItem}>
                Disclosure of Your Personal Data
              </Text>
            </View>

            <Text style={styles.privacyTopTextBoldItem}>
              Business Transactions
            </Text>

            <Text style={styles.privacyTopTextItem}>
              If the Company is involved in a merger, acquisition or asset sale,
              Your Personal Data may be transferred. We will provide notice before
              Your Personal Data is transferred and becomes subject to a different
              Privacy Policy.
            </Text>

            <Text style={styles.privacyTopTextBoldItem}>
              Law enforcement
            </Text>

            <Text style={styles.privacyTopTextItem}>
              Under certain circumstances, the Company may be required to disclose
              Your Personal Data if required to do so by law or in response to
              valid requests by public authorities (e.g. a court or a government
              agency).
            </Text>

            <Text style={styles.privacyTopTextBoldItem}>
              Other legal requirements
            </Text>

            <Text style={styles.privacyTopTextItem}>
              The Company may disclose Your Personal Data in the good faith belief
              that such action is necessary to:
            </Text>

            {/*list items*/}
            <View style={styles.privacyListItemsContainer}>
              <Unorderedlist bulletUnicode={0x2022} color={COLORS.white}>
                <Text style={styles.privacyTopTextItem}>
                  Comply with a legal obligation
                </Text>
              </Unorderedlist>
              <Unorderedlist bulletUnicode={0x2022} color={COLORS.white}>
                <Text style={styles.privacyTopTextItem}>
                  Protect and defend the rights or property of the Company
                </Text>
              </Unorderedlist>
              <Unorderedlist bulletUnicode={0x2022} color={COLORS.white}>
                <Text style={styles.privacyTopTextItem}>
                  Prevent or investigate possible wrongdoing in connection with the
                  Service
                </Text>
              </Unorderedlist>
              <Unorderedlist bulletUnicode={0x2022} color={COLORS.white}>
                <Text style={styles.privacyTopTextItem}>
                  Protect the personal safety of Users of the Service or the public
                </Text>
              </Unorderedlist>
              <Unorderedlist bulletUnicode={0x2022} color={COLORS.white}>
                <Text style={styles.privacyTopTextItem}>
                  Protect against legal liability
                </Text>
              </Unorderedlist>
            </View>
          </View>

          {/*security section*/}
          <View style={styles.privacyTopTextContainer}>
            {/*sub title section*/}
            <View style={styles.privacySubHeadingTextContainer}>
              <Text style={styles.privacySubHeadingTextItem}>
                Security of Your Personal Data
              </Text>
            </View>

            <Text style={styles.privacyTopTextItem}>
              The security of Your Personal Data is important to Us, but remember
              that no method of transmission over the Internet, or method of
              electronic storage is 100% secure. While We strive to use
              commercially acceptable means to protect Your Personal Data, We
              cannot guarantee its absolute security.
            </Text>
          </View>

          {/*children section*/}
          <View style={styles.privacyTopTextContainer}>
            {/*sub title section*/}
            <View style={styles.privacySubHeadingTextContainer}>
              <Text style={styles.privacySubHeadingTextItem}>
                Children's Privacy
              </Text>
            </View>

            <Text style={styles.privacyTopTextItem}>
              Our Service does not address anyone under the age of 13. We do not
              knowingly collect personally identifiable information from anyone
              under the age of 13. If You are a parent or guardian and You are
              aware that Your child has provided Us with Personal Data, please
              contact Us. If We become aware that We have collected Personal Data
              from anyone under the age of 13 without verification of parental
              consent, We take steps to remove that information from Our servers.
            </Text>

            <Text style={styles.privacyTopTextItem}>
              If We need to rely on consent as a legal basis for processing Your
              information and Your country requires consent from a parent, We may
              require Your parent's consent before We collect and use that
              information.
            </Text>
          </View>

          {/*links section*/}
          <View style={styles.privacyTopTextContainer}>
            {/*sub title section*/}
            <View style={styles.privacySubHeadingTextContainer}>
              <Text style={styles.privacySubHeadingTextItem}>
                Links to Other Websites
              </Text>
            </View>

            <Text style={styles.privacyTopTextItem}>
              Our Service may contain links to other websites that are not
              operated by Us. If You click on a third party link, You will be
              directed to that third party's site. We strongly advise You to
              review the Privacy Policy of every site You visit.
            </Text>

            <Text style={styles.privacyTopTextItem}>
              We have no control over and assume no responsibility for the
              content, privacy policies or practices of any third party sites or
              services.
            </Text>
          </View>

          {/*changes section*/}
          <View style={styles.privacyTopTextContainer}>
            {/*sub title section*/}
            <View style={styles.privacySubHeadingTextContainer}>
              <Text style={styles.privacySubHeadingTextItem}>
                Changes to this Privacy Policy
              </Text>
            </View>

            <Text style={styles.privacyTopTextItem}>
              We may update Our Privacy Policy from time to time. We will notify
              You of any changes by posting the new Privacy Policy on this screen.
            </Text>

            <Text style={styles.privacyTopTextItem}>
              We will let You know via email and/or a prominent notice on Our
              Service, prior to the change becoming effective and update the "Last
              updated" date at the top of this Privacy Policy.
            </Text>

            <Text style={styles.privacyTopTextItem}>
              You are advised to review this Privacy Policy periodically for any
              changes. Changes to this Privacy Policy are effective when they are
              posted on this screen.
            </Text>
          </View>

          {/*contact section*/}
          <View style={styles.privacyTopTextContainer}>
            {/*sub title section*/}
            <View style={styles.privacySubHeadingTextContainer}>
              <Text style={styles.privacySubHeadingTextItem}>
                Contact Us
              </Text>
            </View>

            <Text style={styles.privacyTopTextItem}>
              If you have any questions about this Privacy Policy, You can contact
              us:
            </Text>

            <Text style={styles.privacyTopTextItem}>
              By email: <Text style={styles.privacyTopTextBoldItem}>bronwin@reecheble.com</Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    )
  }

  //screen scroller section
  function renderScreenScrollerSection() {
    return (
      <View style={styles.privacyScreenScrollerContainer}>
        <TouchableOpacity
          onPress={scrollToTopFunction}
          style={styles.privacyScrollerContent}>
          <AntDesign name="upcircle" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.privacyContainer}>
      {renderHeaderSection()}
      {renderTermsContentSection()}
      {renderScreenScrollerSection()}
    </View>
  );
};

const styles = StyleSheet.create({
  privacyContainer: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  privacyHeaderTermsComponentContainer: {
    marginTop: Platform.OS === "ios" ? "10%" : 0,
  },
  privacyScreenHeaderTitleContainer: {
    marginTop: 15,
    paddingHorizontal: 15,
    justifyContent: "center",
    alignItems: "flex-start",
    flexDirection: "column",
    marginBottom: 10,
  },
  privacyScreenHeaderTitleItem: {
    color: COLORS.teal,
    fontSize: 26,
    fontFamily: "PoppinsBold",
  },
  privacyScreenHeaderSubTitleItem: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "PoppinsLight"
  },

  //main privacy content
  privacyMainTopTextContent: {
    marginTop: 10,
    paddingHorizontal: 15,
    marginBottom: Platform.OS === "ios" ? 80 : 0,
  },
  privacyTopTextContainer: {
    flexDirection: "column"
  },
  privacyTopTextItem: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsLight",
    marginBottom: 10,
  },
  privacyTopTextBoldItem: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: "PoppinsBold",
    marginBottom: 10,
  },
  privacyTopTextLinkItem: {
    color: COLORS.lightBlue,
    fontSize: 12,
    fontFamily: "PoppinsBold",
  },
  privacySubHeadingTextContainer: {
    marginVertical: 5,
  },
  privacySubHeadingTextItem: {
    color: COLORS.teal,
    fontSize: 24,
    fontFamily: "PoppinsBold",
  },
  privacyListItemsContainer: {
    paddingHorizontal: 10,
    flexDirection: "column",
  },

  //screen scroller section
  privacyScreenScrollerContainer: {
    top: Platform.OS === "ios" ? -50 : 0,
    marginTop: Platform.OS === "ios" ? -50 : 10,
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  privacyScrollerContent: {
    width: 40,
    height: 40,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.purpleDark,
  },
});

export default PolicyScreen;
