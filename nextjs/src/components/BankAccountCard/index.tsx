import { useContext } from "react";
import BankContext from "src/context/BankContext";
import { BankAccount } from "../../model";
import classes from "./BankAccount.module.scss";

interface BankAccountProps {
  bankAccount: BankAccount;
}
const BankAccountCard: React.FunctionComponent<BankAccountProps> = (props) => {
  const { bankAccount } = props;
  const bank = useContext(BankContext);
  return (
    <article className={`${classes.root} ${classes[bank.cssCode]}`}>
      <div className={classes.infoBank}>
        <h2 className={classes.ownerName}>{bankAccount.owner_name}</h2>
        <p className={`${classes.accountNumber} ${classes[bank.cssCode]}`}>
          Conta: {bankAccount.account_number}
        </p>
      </div>
      <span className={`fas fa-chevron-right ${classes.iconRight} ${classes[bank.cssCode]}`} />
    </article>
  );
};

export default BankAccountCard;
