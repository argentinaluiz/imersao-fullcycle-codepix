import classes from "./PixKey.module.scss";
import { PixKey } from "../../model";
import { useContext } from "react";
import BankContext from "src/context/BankContext";
interface PixKeyProps {
  pixKey: PixKey;
}

const pixKeyKinds = {
  cpf: "CPF",
  email: "E-mail",
};

const PixKeyCard: React.FunctionComponent<PixKeyProps> = (props) => {
  const { pixKey } = props;
  const bank = useContext(BankContext);
  return (
    <div className={`${classes.root} ${classes[bank.cssCode]}`}>
      <p className={classes.kind}>{pixKeyKinds[pixKey.kind]}</p>
      <span className={classes.key}>{pixKey.key}</span>
    </div>
  );
};

export default PixKeyCard;
