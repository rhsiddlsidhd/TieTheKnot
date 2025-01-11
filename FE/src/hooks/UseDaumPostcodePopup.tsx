import { useDaumPostcodePopup } from "react-daum-postcode";
import { OrderFormData } from "../pages/Order";
import { SetStateAction } from "react";

interface UseDaumPostcodePopupProps {
  setOrderData: React.Dispatch<SetStateAction<OrderFormData>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
  orderData: OrderFormData;
}

const UseDaumPostcodePopup = ({
  setOrderData,
  setError,
  orderData,
}: UseDaumPostcodePopupProps) => {
  const open = useDaumPostcodePopup(
    process.env.REACT_APP_DAUM_POST_CODE_POP_UP_URL
  );

  const handleComplete = (data: any) => {
    const field = "weddingAddress";
    let fullAddress = data.address;
    let extraAddress = "";

    if (data.addressType === "R") {
      if (data.bname !== "") {
        extraAddress += data.bname;
      }
      if (data.buildingName !== "") {
        extraAddress +=
          extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
    }

    setOrderData((prev) => ({ ...prev, [field]: fullAddress }));
  };

  const handleDaumPopupOpen = () => {
    setError("");
    open({ onComplete: handleComplete });
  };
  return (
    <>
      <input
        style={{
          width: `${orderData["weddingAddress"].length}em`,
          minWidth: "13em",
        }}
        type="text"
        onClick={() => handleDaumPopupOpen()}
        readOnly
        value={orderData["weddingAddress"]}
      />
      {/* <input type="text" /> */}
    </>
  );
};
export default UseDaumPostcodePopup;
