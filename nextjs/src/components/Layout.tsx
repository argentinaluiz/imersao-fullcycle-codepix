import Head from "next/head";
import Footer from "./Footer";
import MainContent from "./MainContent";
import Navbar from "./Navbar";

export const Layout: React.FunctionComponent = (props) => {
  return (
    <>
      <Head>
        <title>Code Pix</title>
        <meta charSet="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,300,500,600,700" rel="stylesheet"/>
      </Head>
      <Navbar />
      <MainContent>
        {props.children}
      </MainContent>
      <Footer />
    </>
  );
};
