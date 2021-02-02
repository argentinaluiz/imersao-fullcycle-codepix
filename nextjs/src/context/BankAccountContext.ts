import {createContext} from "react";
import { BankAccount } from "src/model";

const BankAccountContext = createContext<BankAccount>(null);

export default BankAccountContext;
