import Button from "components/Button";
import FormField from "components/FormField";
import useBank from "hooks/useBank";
import { FC, useState } from "react";

const Transfer: FC = () => {
  const { error, transfer } = useBank();

  const [formValues, setFormValues] = useState({
    receiver: "",
    amount: 0,
    title: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;

    if (name == "amount") {
      setFormValues((prev) => ({ ...prev, [name]: parseFloat(value) }));
    } else {
      setFormValues((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSend = () => {
    transfer(formValues.receiver, formValues.amount, formValues.title);
  };

  return (
    <div>
      <div className="mb-5 flex gap-5">
        <FormField
          onChange={handleInputChange}
          type="text"
          label="Receiver's account number"
          name="receiver"
          value={formValues.receiver}
        />
        <FormField
          onChange={handleInputChange}
          type="number"
          label="Amount"
          name="amount"
          value={formValues.amount}
        />
        <FormField
          onChange={handleInputChange}
          type="text"
          label="Title"
          name="title"
          value={formValues.title}
        />
      </div>
      <Button onClick={handleSend}>Send</Button>
      {error}
    </div>
  );
};

export default Transfer;
