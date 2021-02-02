import { useContext } from "react";
import BankContext from "src/context/BankContext";
import BankAccountContext from "../../context/BankAccountContext";
import LinkButton from "../LinkButton";
import classes from "./Navbar.module.scss";

type Props = {};
const Navbar = (props: Props) => {
  const bankAccount = useContext(BankAccountContext);
  const bank = useContext(BankContext);

  return (
    <nav
      className={`navbar navbar-expand-md ${classes.root} ${
        classes[bank.cssCode]
      }`}
    >
      <div className={`container ${classes.navbarBody}`}>
        <LinkButton
          className={`navbar-brand ${classes.navbarBrand}`}
          LinkProps={{
            href: "/bank-accounts",
            as: "/bank-accounts",
          }}
        >
          <img src="/img/icone_banco.png" alt="" className={classes.logoBank} />
          <div className={classes.bankName}>
            <span>Cod - {bank.code}</span>
            <h2>{bank.name}</h2>
          </div>
        </LinkButton>
        {bankAccount && (
          <div className={`navbar-collapse ${classes.navbarRightRoot}`}>
            <ul className={`navbar-nav ${classes.navbarRightBody} ml-auto`}>
              <li className={`nav-item ${classes.bankAccountInfo}`}>
                <img
                  src="/img/icon-user.png"
                  alt="usuário"
                  className={classes.iconUser}
                />
                <p className={classes.onwerName}>
                  {bankAccount.owner_name} | C/C: {bankAccount.account_number}
                </p>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
