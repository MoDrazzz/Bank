import Button from "components/Button";
import FormField from "components/FormField";
import Heading from "components/Heading";
import Paragraph from "components/Paragraph";
import { useAuthContext } from "contexts/AuthContext";
import useBank from "hooks/useBank";
import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";

interface FormValues {
  receiver: string;
  amount: "" | number;
  title: "";
}

const initialFormValues: FormValues = {
  receiver: "",
  amount: 1,
  title: "",
};

const Transfer: FC = () => {
  const [formValues, setFormValues] = useState<FormValues>(initialFormValues);
  const [stage, setStage] = useState(1);
  const { error, transfer, setError } = useBank();
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;

    if (name == "amount") {
      const floatValue = +parseFloat(value).toFixed(2);

      setFormValues((prev) => ({
        ...prev,
        [name]: isNaN(floatValue) ? "" : floatValue,
      }));
    } else {
      setFormValues((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCancel = () => {
    setFormValues(initialFormValues);
    setStage(1);
    setError("");
  };

  const handleSend = async () => {
    if (typeof formValues.amount != "number" || formValues.amount <= 0) {
      return;
    }
    transfer(
      formValues.receiver.trim(),
      formValues.amount,
      formValues.title.trim()
    ).then((res) => {
      if (res === 200) {
        setStage(3);
        setFormValues(initialFormValues);
      } else {
        setStage(1);
      }
    });
  };

  const getBalanceAfterOperation = (): number | string => {
    if (
      !user?.balance ||
      typeof formValues.amount != "number" ||
      formValues.amount <= 0
    ) {
      return "Error";
    }
    return (user.balance - formValues.amount).toFixed(2);
  };

  return (
    <div className="grid gap-5">
      {stage === 1 ? (
        <>
          <Heading>Transfer money</Heading>
          <div className="flex gap-5">
            <FormField
              onChange={handleInputChange}
              label="Receiver's account number"
              name="receiver"
              value={formValues.receiver}
            />
            <FormField
              onChange={handleInputChange}
              label="Amount"
              name="amount"
              type="number"
              value={formValues.amount}
            />
            <FormField
              onChange={handleInputChange}
              label="Title"
              name="title"
              value={formValues.title}
            />
          </div>
          <div>
            <Button
              disabled={
                formValues.title.trim().length == 0 ||
                formValues.receiver.trim().length == 0 ||
                typeof formValues.amount != "number" ||
                formValues.amount <= 0
              }
              onClick={() => setStage(2)}
            >
              Proceed to summary
            </Button>
          </div>
          {error}
        </>
      ) : stage === 2 ? (
        <div className="grid gap-5">
          <Heading>Summary</Heading>
          <div>
            <Paragraph>Receiver: {formValues.receiver}</Paragraph>
            <Paragraph>Amount: {formValues.amount}$</Paragraph>
            <Paragraph>Title: {formValues.title}</Paragraph>
            <Paragraph>
              Balance after operation: {getBalanceAfterOperation()}
            </Paragraph>
          </div>
          <div className="flex gap-5">
            <Button isRed onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSend}>Send</Button>
          </div>
        </div>
      ) : stage === 3 ? (
        <div className="grid gap-5">
          <Heading>Transfer has just been sent!</Heading>
          <Paragraph>What do you want to do now?</Paragraph>
          <div className="flex gap-5">
            <Button onClick={() => setStage(1)}>Send another transfer</Button>
            <Button onClick={() => navigate("/dashboard")}>
              Go to dashboard
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Transfer;
