// @flow
import {
  GetServerSideProps,
  GetStaticPaths,
  GetStaticProps,
  NextPage,
} from "next";
import { BankAccountBalance } from "../../../components/BankAccountBalance";
import LinkButton from "../../../components/LinkButton";
import { Layout } from "../../../components/Layout";
import classes from "./BankAccountDashboard.module.scss";
import { bankHttp } from "../../../util/http";
import { useContext } from "react";
import BankAccountContext from "../../../context/BankAccountContext";
import { Transaction } from "src/model";
import format from "date-fns/format";
import parseISO from "date-fns/parseISO";
import { useRouter } from "next/dist/client/router";
import Title from "@/components/Title";

const Header = () => {
  const bankAccount = useContext(BankAccountContext);
  
  return (
    <div className={`container ${classes.header}`}>
      <BankAccountBalance balance={bankAccount.balance} />
      <div className={classes.buttonActions}>
        <LinkButton
          LinkProps={{
            href: "/bank-accounts/[id]/pix/transactions/register",
            as: `/bank-accounts/${bankAccount.id}/pix/transactions/register`,
          }}
        >
          Realizar transferência
        </LinkButton>
        <LinkButton
          LinkProps={{
            href: "/bank-accounts/[id]/pix/register",
            as: `/bank-accounts/${bankAccount.id}/pix/register`,
          }}
        >
          Cadastrar chave pix
        </LinkButton>
      </div>
    </div>
  );
};

interface BankAccountDashboardProps {
  transactions: Transaction[];
}
const BankAccountDashboard: NextPage<BankAccountDashboardProps> = (props) => {
  const { transactions } = props;
  const router = useRouter();

  if (router.isFallback) {
    return (
      <Layout>
        <Title>Carregando...</Title>
      </Layout>
    );
  }

  return (
    <Layout>
      <Header />
      <div>
        <h1 className={classes.titleTable}>Últimos lançamentos</h1>

        <table
          className={`table table-borderless table-striped ${classes.tableTransactions}`}
        >
          <thead>
            <tr>
              <th scope="col">Data</th>
              <th scope="col" colSpan={3}>
                Descrição
              </th>
              <th scope="col" className="text-right">
                Valor (R$)
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t, key) => (
              <tr key={key}>
                <td>{format(parseISO(t.created_at), "dd/MM")}</td>
                <td colSpan={3}>{t.description}</td>
                <td className="text-right">
                  {t.amount.toLocaleString("pt-BR")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default BankAccountDashboard;

export const getStaticProps: GetStaticProps = async (ctx) => {
  const {
    params: { id },
  } = ctx;
  const [{ data: bankAccount }, { data: transactions }] = await Promise.all([
    bankHttp.get(`bank-accounts/${id}`),
    bankHttp.get(`bank-accounts/${id}/transactions`),
  ]);

  return {
    props: {
      bankAccount,
      transactions,
    },
    revalidate: 30,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: true,
  };
};
