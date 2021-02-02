import { useContext } from "react";
import BankContext from "src/context/BankContext";

interface ButtonProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  variant?: "primary" | "info";
}

const buttonClasses = {
  primary: "btn-primary",
  info: "btn-info",
};

export const Button: React.FunctionComponent<ButtonProps> = (props) => {
  const { variant = "primary", ...rest } = props;
  const bank = useContext(BankContext);
  const className = [
    "btn",
    `${buttonClasses[variant]} ${bank.cssCode}`,
    props.className,
  ]
    .join(" ")
    .trim();
  return <button className={className} {...rest} />;
};
