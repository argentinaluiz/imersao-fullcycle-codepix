import { AppProps } from "next/app";
import BankContext from "src/context/BankContext";
import "../../styles/sass/globals.scss";
import BankAccountContext from "../context/BankAccountContext";

function MyApp({ Component, pageProps }: AppProps) {
  const Main = (
    <BankContext.Provider
      value={{
        name: process.env.NEXT_PUBLIC_BANK_NAME,
        code: process.env.NEXT_PUBLIC_BANK_CODE,
        get cssCode(){
          return `bank${this.code}`
        }
      }}
    >
      <Component {...pageProps} />
    </BankContext.Provider>
  );

  if ("bankAccount" in pageProps) {
    return (
      <BankAccountContext.Provider value={pageProps.bankAccount}>
        {Main}
      </BankAccountContext.Provider>
    );
  }
  return Main;
}

export default MyApp;