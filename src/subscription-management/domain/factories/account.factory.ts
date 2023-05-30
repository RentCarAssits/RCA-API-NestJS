import { Account } from "../entity/account.entity";
import { AccountEmail } from "../values/account-email.value";
import { AccountId } from "../values/account-id.value";
import { AccountNickname } from "../values/account-nickname.value";

export class AccountFactory{
    public static createFrom(
        AccountEmail:AccountEmail,
        AccountNickname:AccountNickname
    ): Account{
        return new Account(AccountEmail,AccountNickname);
    }

    public static WithId(
        AccountId: AccountId,
        AccountEmail:AccountEmail,
        AccountNickname:AccountNickname
    ): Account{
        const account: Account = new Account(
            AccountEmail,
            AccountNickname
        );
        account.changeId(AccountId);
        return account;
    }
}