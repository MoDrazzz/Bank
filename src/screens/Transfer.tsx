import Button from "components/Button";
import FormField from "components/FormField";
import useBank from "hooks/useBank";
import { FC, useState } from "react";

const initialFormValues = {
  receiver: "",
  amount: 1,
  title: "",
};

const Transfer: FC = () => {
  const { error, transfer } = useBank();

  const [formValues, setFormValues] = useState(initialFormValues);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;

    if (name == "amount") {
      if (value)
        setFormValues((prev) => ({ ...prev, [name]: parseFloat(value) }));
    } else {
      setFormValues((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSend = () => {
    transfer(
      formValues.receiver.trim(),
      formValues.amount,
      formValues.title.trim()
    ).then((res) => {
      res === 200 ? setFormValues(initialFormValues) : null;
    });
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
          min={0.1}
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
        <Button
          disabled={
            formValues.title.trim().length == 0 ||
            formValues.receiver.trim().length == 0
          }
          onClick={handleSend}
        >
          Send
        </Button>
      </div>
      {error}
    </div>
  );
};

export default Transfer;
