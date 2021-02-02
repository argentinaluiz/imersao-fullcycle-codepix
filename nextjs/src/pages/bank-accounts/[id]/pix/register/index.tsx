import classes from "./PixRegister.module.scss";

import Card from "@/components/Card";
import { Layout } from "@/components/Layout";
import Title from "@/components/Title";
import { Button } from "@/components/Button";
import { useForm } from "react-hook-form";
import { bankHttp } from "../../../../../util/http";
import { GetServerSideProps, NextPage } from "next";
import { useContext } from "react";
import BankAccountContext from "../../../../../context/BankAccountContext";
import { PixKey } from "../../../../../model";
import PixKeyCard from "@/components/PixKeyCard";
import FormButtonActions from "@/components/FormButtonActions";
import Input from "@/components/Form/Input";
import Modal from "../../../../../util/modal";
import { useRouter } from "next/dist/client/router";

interface PixRegisterProps {
  pixKeys: PixKey[];
}

const PixRegister: NextPage<PixRegisterProps> = (props) => {
  const { pixKeys } = props;
  const { register, handleSubmit } = useForm();
  const router = useRouter();
  const bankAccount = useContext(BankAccountContext);
  async function onSubmit(data) {
    try {
      await bankHttp.post(`bank-accounts/${bankAccount.id}/pix-keys`, data);
      Modal.fire({
        title: "Chave cadastrada com sucesso",
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
      <div className="row">
        <div className="col-sm-6">
          <Title>Cadastrar chave Pix</Title>
          <Card>
            <form onSubmit={handleSubmit(onSubmit)}>
              <p className={classes.kindInfo}>Escolha um tipo de chave</p>
              <Input
                name="kind"
                type={"radio"}
                label={"CPF"}
                ref={register}
                value="cpf"
              />
              <Input
                name="kind"
                type={"radio"}
                label={"E-mail"}
                ref={register}
                value="email"
              />
              <Input name="key" label={"Digite a chave"} ref={register} />
              <FormButtonActions>
                <Button type="submit">Cadastrar</Button>
                <Button type="button" variant="info">
                  Voltar
                </Button>
              </FormButtonActions>
            </form>
          </Card>
        </div>
        <div className="col-sm-4 offset-md-2">
          <Title>Minhas chaves pix</Title>
          {pixKeys.map((p, key) => (
            <PixKeyCard key={key} pixKey={p} />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default PixRegister;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const {
    query: { id },
  } = ctx;
  const [{ data: bankAccount }, { data: pixKeys }] = await Promise.all([
    bankHttp.get(`bank-accounts/${id}`),
    bankHttp.get(`bank-accounts/${id}/pix-keys`),
  ]);

  return {
    props: {
      bankAccount,
      pixKeys,
    },
  };
};
