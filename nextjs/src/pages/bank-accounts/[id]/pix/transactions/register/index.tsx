// @flow
import { useRouter } from "next/dist/client/router";
import * as React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/Button";
import Card from "@/components/Card";
import Input from "@/components/Form/Input";
import Select from "@/components/Form/Select";
import FormButtonActions from "@/components/FormButtonActions";
import { Layout } from "@/components/Layout";
import Title from "@/components/Title";
import BankAccountContext from "../../../../../../context/BankAccountContext";
import { bankHttp } from "../../../../../../util/http";
import Modal from "../../../../../../util/modal";
import { GetStaticPaths, GetStaticProps } from "next";
type Props = {};
const TransactionRegister = (props: Props) => {
  const { register, handleSubmit } = useForm();
  const bankAccount = React.useContext(BankAccountContext);
  const router = useRouter();
  
  async function onSubmit(data) {
    try {
      await bankHttp.post(`bank-accounts/${bankAccount.id}/transactions`, {
        ...data,
        amount: new Number(data.amount)
      });
      Modal.fire({
        title: "Transação realizada com sucesso",
        icon: "success",
      });
      router.push("/bank-accounts");
    } catch (e) {
      console.error(e);
      Modal.fire({
        title: "Ocorreu um erro. Verifique o console",
        icon: "error",
      });
    }
  }

  return (
    <Layout>
      <Title>Realizar transferência</Title>
      <Card>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row">
            <div className="col-sm-4">
              <Select label="Tipo" name="pix_key_kind" ref={register}>
                <option value="cpf">CPF</option>
                <option value="email">E-mail</option>
              </Select>
            </div>
            <div className="col-sm-8">
              <Input name="pix_key_key" label={"Chave"} ref={register} />
            </div>
          </div>
          <Input
            name="amount"
            type="number"
            step=".01"
            label="Valor"
            ref={register}
            defaultValue="0.00"
          />
          <Input
            name="description"
            label="Descrição"
            ref={register}
          />
          <FormButtonActions>
            <Button type="submit">Cadastrar</Button>
            <Button type="button" variant="info">
              Voltar
            </Button>
          </FormButtonActions>
        </form>
      </Card>
    </Layout>
  );
};

export default TransactionRegister;

export const getStaticProps: GetStaticProps = async (ctx) => {
  const {
    params: { id },
  } = ctx;
  const { data: bankAccount } = await bankHttp.get(`bank-accounts/${id}`);

  return {
    props: {
      bankAccount,
    },
    revalidate: 120
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: true,
  };
};