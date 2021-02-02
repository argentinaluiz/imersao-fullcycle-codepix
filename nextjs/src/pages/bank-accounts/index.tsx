import { GetServerSideProps, NextPage } from "next";
import BankAccountCard from "../../components/BankAccountCard";
import { Layout } from "../../components/Layout";
import LinkButton from "../../components/LinkButton";
import Title from "../../components/Title";
import { BankAccount } from "../../model";
import { bankHttp } from "../../util/http";

interface AccountsListProps {
  bankAccounts: BankAccount[];
}
const AccountsList: NextPage<AccountsListProps> = (props) => {
  const { bankAccounts } = props;
  return (
    <Layout>
      <Title>Contas bancárias</Title>
      <div className="row">
        {bankAccounts.map((b, key) => (
          <LinkButton
            key={key}
            title="Navegar para conta"
            className="col-12 col-sm-6 col-md-4"
            LinkProps={{
              href: "/bank-accounts/[id]",
              as: `/bank-accounts/${b.id}`,
            }}
          >
            <BankAccountCard bankAccount={b} />
          </LinkButton>
        ))}
      </div>
    </Layout>
  );
};

export default AccountsList;

export const getServerSideProps: GetServerSideProps = async () => {
  const { data: bankAccounts } = await bankHttp.get("bank-accounts");

  return {
    props: {
      bankAccounts,
    },
  };
};