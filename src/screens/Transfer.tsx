import Button from "components/Button";
import FormField from "components/FormField";
import useBank from "hooks/useBank";
import { FC, useEffect, useState } from "react";
import { flushSync } from "react-dom";

const initialFormValues = {
  receiver: "",
  amount: 0,
  title: "",
};

const Transfer: FC = () => {
  const { error, transfer } = useBank();

  const [formValues, setFormValues] = useState(initialFormValues);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;

    if (name == "amount") {
      setFormValues((prev) => ({ ...prev, [name]: parseFloat(value) }));
    } else {
      setFormValues((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSend = () => {
    transfer(formValues.receiver, formValues.amount, formValues.title).then(
      (res) => {
        res === 200 ? setFormValues(initialFormValues) : null;
      }
    );
  };

  return (
    <div className="grid gap-5">
      <div className="flex gap-5">
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
      <div>
        <Button onClick={handleSend}>Send</Button>
      </div>
      {error}
    </div>
  );
};

export default Transfer;
