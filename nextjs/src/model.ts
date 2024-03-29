export interface BankAccount {
  id: string;
  owner_name: string;
  balance: number;
  account_number: string;
}

export enum PixKeyKind {
  cpf = "cpf",
  email = "email",
}

export interface PixKey {
  id: string;
  kind: PixKeyKind;
  key: string;
}

export enum TransactionStatus{
  pending = 'pending',
  completed = 'completed',
  error = 'error'
};

export enum TransactionOperation{
  debit = 'debit',
  credit = 'credit'
}

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  bank_account_id: string;
  bank_account_from_id: string;
  pix_key_key: string;
  pix_key_kind: PixKeyKind;
  status: TransactionStatus;
  operation: TransactionOperation
  created_at: string;
}