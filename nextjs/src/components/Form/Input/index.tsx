import slug from "slug";
import { forwardRef } from "react";

interface InputProps
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  label?: string;
}

const formGroupClasses = {
  text: "form-group",
  number: "form-group",
  radio: "form-check",
};

const inputClasses = {
  text: "form-control",
  number: "form-control",
  radio: "form-check-input",
};

const labelClasses = {
  text: "",
  number: "",
  radio: "form-check-label",
};

const Input = forwardRef<any, InputProps>((props, ref) => {
  const { label: labelText, className, type = "text", ...rest } = props;
  const id = props.id ?? props.name ?? slug(labelText ?? "");
  const Label = labelText && (
    <label className={labelClasses[type]} htmlFor={id}>
      {labelText}
    </label>
  );
  const CustomInput: any = (
    <input
      id={id}
      className={inputClasses[className ?? type]}
      type={type}
      ref={ref}
      {...rest}
    />
  );
  return (
    <div className={formGroupClasses[type]}>
      {type === "radio" && (
        <>
          {CustomInput}
          {Label}
        </>
      )}
      {(type === "text" || type === "number") && (
        <>
          {Label}
          {CustomInput}
        </>
      )}
    </div>
  );
});

export default Input;
