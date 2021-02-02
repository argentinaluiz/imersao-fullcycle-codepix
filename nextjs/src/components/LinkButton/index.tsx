import Link, { LinkProps } from "next/link";
import { useContext } from "react";
import BankContext from "src/context/BankContext";
import classes from "./LinkButton.module.scss";

export interface LinkButtonProps
  extends React.DetailedHTMLProps<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
  > {
  LinkProps?: LinkProps;
}

const LinkButton: React.FunctionComponent<LinkButtonProps> = (props) => {
  const { LinkProps, ...rest } = props;
  const bank = useContext(BankContext);
  const className = [rest.className, classes.root, classes[bank.cssCode]]
    .join(" ")
    .trim();

  if (LinkProps) {
    return (
      <Link {...LinkProps}>
        <a className={className} {...rest} />
      </Link>
    );
  }

  return <a className={className} {...rest} />;
};

export default LinkButton;
