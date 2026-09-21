import type { PaperAccount } from "../../../types/paperTrading";
import ResetAccountForm from "./ResetAccountForm";

type AccountSettingsProps = {
	account: PaperAccount;
	isResetting: boolean;
	onReset: (balance: number) => void;
};

export default function AccountSettings(props: AccountSettingsProps) {
	return <ResetAccountForm {...props} />;
}