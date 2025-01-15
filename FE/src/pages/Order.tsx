import React, { useEffect, useState } from "react";
import styled from "styled-components";
import useAuthFailRedirect from "../hooks/useAuthFailRedirect";
import { postOrderInvite } from "../apis/api/order/postOrderInvite";
import { generateRandomId } from "../utils/generateRandomId";
import { useNavigate } from "react-router";
import orderDataValidator from "../utils/validators/orderDataValidator";
import { createMaxLengthUrls, transformFilesToUrls } from "../utils/urlUtils";
import UseDaumPostcodePopup from "../hooks/UseDaumPostcodePopup";
import { handleError } from "./../utils/error/errorHandler";
import { updateField } from "../utils/orderFormUtils";

export interface Gallery {
  [key: string]: {
    type: string;
    urls: string[];
  };
}

export interface Account {
  name: string;
  bankName: string;
  accountNumber: string;
}

export interface Parent {
  badge: string;
  name: string;
  isDeceased: boolean;
}

interface Name {
  groom: string;
  bride: string;
}

export interface OrderFormData {
  name: Name;
  weddingAddress: string;
  weddingAddressDetail: string;
  weddingDate: string;
  account: Account[];
  parent: Parent[];
  thumnail: string[];
  gallery: Gallery;
}

type Badge = "default" | "신랑측 부" | "신랑측 모" | "신부측 부" | "신부측 모";

const Order = () => {
  useAuthFailRedirect();

  const navigate = useNavigate();
  const badge = ["신랑측 부", "신랑측 모", "신부측 부", "신부측 모"];
  const galleryType = ["A", "B", "C", "D", "E", "F", "G"];
  const [error, setError] = useState<string>("");
  const [checkBox, setCheckBox] = useState<string[]>([]);
  const [weddingDate, setWeddingDate] = useState<string[]>([]);
  const [orderData, setOrderData] = useState<OrderFormData>({
    name: { groom: "", bride: "" },
    weddingAddress: "",
    weddingAddressDetail: "",
    weddingDate: "",
    account: [],
    parent: [],
    thumnail: [],
    gallery: {},
  });

  useEffect(() => {
    if (error === "Invalid jwt") {
      alert(
        "로그인 세션이 만료되었습니다. 불편을 드려 죄송합니다. 다시 로그인해주세요. "
      );
      navigate("/");
    }
  }, [error, navigate]);

  useEffect(() => {
    if (weddingDate.length === 2) {
      const field = "weddingDate";
      setOrderData((prev) => ({ ...prev, [field]: weddingDate.join(" ") }));
    }
  }, [weddingDate]);

  const handleSubmitOrder = async (
    data: OrderFormData,
    e: React.FormEvent<HTMLFormElement>,
    success: () => void
  ): Promise<void> => {
    e.preventDefault();

    try {
      /**
       * 여기서 타입에 따른 urls의 개수를 체크할 수 밖에 없다~
       */
      orderDataValidator.weddingAddressValidator(data.weddingAddress);
      orderDataValidator.weddingDateValidator(data.weddingDate);
      orderDataValidator.weddingAccountValidator(data.account);
      orderDataValidator.weddingParentValidator(data.parent);
      orderDataValidator.weddingThumnail(data.thumnail);
      orderDataValidator.weddingGallery(data.gallery);

      const _data = await postOrderInvite(data);

      const { message } = _data;
      if (message === "success") {
        alert("주문이 완료되었습니다.");
        success();
      }
    } catch (error) {
      handleError(error, setError);
    }
  };

  const handleTextOnChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fields?: string
  ) => {
    e.preventDefault();
    const value = e.target.value;

    if (!fields) {
      setOrderData((prev) => ({
        ...prev,
        weddingAddressDetail: value,
      }));
    } else {
      //중첩객체에 깊이 들어갈때 keyof 타입 확정에 대해 어려움을 겪는다 하오..
      //부족함이 너무많다 하ㅏㅏㅏㅏ

      setOrderData((prev) => {
        const fieldArray = fields.split(".");
        const lastField = fieldArray.pop();
        if (lastField === "groom" || lastField === "bride") {
          return { ...prev, name: { ...prev.name, [lastField]: value } };
        }
        return prev;
      });
    }
  };

  const handleOnchange = (
    field: keyof OrderFormData,
    optionKey: keyof Account | keyof Parent,
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    e.preventDefault();
    const { checked, value, type } = e.target;
    setOrderData((prev) => {
      if (field === "account") {
        return updateField(prev, field, index, optionKey, value);
      }
      if (field === "parent") {
        return updateField(
          prev,
          field,
          index,
          optionKey,
          type === "checkbox" ? checked : value
        );
      }

      return prev;
    });
  };

  const handleOnclick = (
    field: keyof OrderFormData,
    optionKey: keyof Parent,
    index: number,
    e: React.FormEvent<HTMLElement>
  ) => {
    e.preventDefault();
    const { value } = e.currentTarget.dataset;
    setOrderData((prev) => {
      if (!Array.isArray(prev[field])) return prev;
      if (field === "parent" && value) {
        return updateField(prev, field, index, optionKey, value);
      }
      return prev;
    });
  };

  const addOptionField = (
    field: keyof OrderFormData,
    e: React.MouseEvent<HTMLButtonElement>
  ): void => {
    e.preventDefault();

    setOrderData((prev) => {
      if (!Array.isArray(prev[field])) return prev;
      if (field === "account") {
        const _prev = [...prev[field]];
        const updatedData = [
          ..._prev,
          { name: "", bankName: "", accountNumber: "" },
        ];
        return { ...prev, [field]: updatedData };
      } else if (field === "parent") {
        const _prev = [...prev[field]];
        const updatedData = [
          ..._prev,
          { badge: "", name: "", isDeceased: false },
        ];
        return { ...prev, [field]: updatedData };
      }
      return prev;
    });
  };

  const handleImgUrl = async (
    field: string,
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    e.preventDefault();
    try {
      const files = e.target.files;
      if (files) {
        const fileUrls = await transformFilesToUrls(files && Array.from(files));

        if (!fileUrls) {
          throw new Error("URL이 생성되지 않았습니다.");
        }
        setOrderData((prev) => {
          if (field === "thumnail" && Array.isArray(prev[field])) {
            const _prev = [...prev[field]];
            if (_prev.length + 1 > 2) {
              alert("썸네일은 최대 2장까지 입력이 가능합니다.");
              return prev;
            }
            return {
              ...prev,
              [field]: [..._prev, ...fileUrls],
            };
          }
          return prev;
        });
      }
    } catch (error) {
      handleError(error, setError);
    }
  };

  const handleGalleryImageUpload = async (
    field: string,
    galleryId: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    e.preventDefault();
    const files = e.target.files;

    if (files) {
      const fileUrls = await transformFilesToUrls(files && Array.from(files));

      if (!fileUrls) {
        throw new Error("URL이 생성되지 않았습니다.");
      }
      setOrderData((prev) => {
        if (field === "gallery") {
          const _prev = prev[field][galleryId];
          const { type, urls: prevUrls } = _prev;
          const maxLength = createMaxLengthUrls(type);
          const updatedData = {
            type,
            urls: [...prevUrls, ...fileUrls],
          };

          if (maxLength < updatedData.urls.length) {
            alert(
              `${type}타입(${maxLength})에 따른 이미지 개수가 초과하였습니다.`
            );
            return prev;
          }

          return {
            ...prev,
            [field]: {
              ...prev[field],
              [galleryId]: updatedData,
            },
          };
        }
        return prev;
      });
    }
  };

  const handleThumnailReset = (
    field: string,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    setOrderData((prev) => {
      if (field === "thumnail" && Array.isArray(prev[field])) {
        const updatedField = [...prev[field]];
        updatedField.pop();
        return {
          ...prev,
          [field]: updatedField,
        };
      }

      return prev;
    });
  };

  const handleSelectedType: React.MouseEventHandler<HTMLLIElement> = (e) => {
    e.preventDefault();
    const type = e.currentTarget.dataset.value;

    const gallery = e.currentTarget.className;

    if (type && gallery) {
      const _id = generateRandomId();
      setOrderData((prev) => {
        const _prev = prev.gallery;
        const maxLength = 7;
        if (Object.keys(_prev).length + 1 > maxLength) {
          alert("갤러리 타입은 최대 7개 선택 가능합니다.");
          return prev;
        }
        return {
          ...prev,
          gallery: {
            ...prev.gallery,
            [_id]: { type, urls: [] },
          },
        };
      });
    }
  };

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const _id = e.currentTarget.id;
    //체크박스 클릭시 _id 담은 배열을 왔다갔다하기
    //클릭을 안한 박스를 클릭할 수 있고, 클릭을 한 박스를 클릭할 수 있다.
    setCheckBox(
      checkBox.includes(_id)
        ? checkBox.filter((id: string, i: number) => id !== _id)
        : [...checkBox, _id]
    );
  };

  const handleGalleryDelete = (
    totalData: Record<string, any>,
    checkBox: string[],
    e: React.MouseEvent<HTMLButtonElement>
  ): void => {
    e.preventDefault();
    let updatedGalleryIds = { ...totalData };

    checkBox.forEach((id: string) => {
      delete updatedGalleryIds[id];
    });

    setOrderData((prevData) => ({
      ...prevData,
      gallery: updatedGalleryIds,
    }));
    setCheckBox([]);
  };

  const handleWeddingDateTime = (
    e: React.ChangeEvent<HTMLInputElement>,
    setWeddingDate: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    const { value, type } = e.currentTarget;
    setWeddingDate((prev) => {
      if (type === "date" && prev.length < 1) {
        return [...prev, value];
      } else if (type === "time" && prev.length === 1) {
        return [...prev, value];
      }
      return prev;
    });
  };

  const weddingDateReset = (field: string) => {
    setWeddingDate([]);
    setOrderData((prev) => {
      return { ...prev, [field]: "" };
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Enter 키 눌렀을 때 form 제출 방지
    }
  };

  return (
    <Container>
      <Form
        onSubmit={(e) =>
          handleSubmitOrder(orderData, e, () => navigate("/register"))
        }
      >
        <NameWrapper>
          <h4>웨딩 주인공 성함</h4>
          <div>
            <label htmlFor="groom-name">신랑</label>
            <input
              id="groom-name"
              type="text"
              placeholder="신랑 성함"
              onChange={(e) => handleTextOnChange(e, "name.groom")}
              onKeyDown={handleKeyPress}
            />
            <label htmlFor="bride-name">신부</label>
            <input
              id="bride-name"
              type="text"
              placeholder="신부 성함"
              onChange={(e) => handleTextOnChange(e, "name.bride")}
              onKeyDown={handleKeyPress}
            />
          </div>
        </NameWrapper>
        <AddressWrapper>
          <h4>웨딩홀 주소</h4>
          <div>
            <UseDaumPostcodePopup
              setOrderData={setOrderData}
              setError={setError}
              orderData={orderData}
            />
            <div>
              <label htmlFor="address_detail">상세주소</label>
              <input
                id="address_detail"
                placeholder="상세주소"
                type="text"
                onChange={(e) => handleTextOnChange(e)}
                onKeyDown={handleKeyPress}
                style={{
                  minWidth: `${orderData["weddingAddressDetail"].length}em`,
                }}
              />
            </div>
          </div>
        </AddressWrapper>
        <WeddingDate>
          <h4>웨딩 날짜</h4>
          <div>
            <button
              type="button"
              onClick={() => weddingDateReset("weddingDate")}
            >
              날짜 초기화
            </button>
          </div>
          <input
            type="date"
            onChange={(e) => handleWeddingDateTime(e, setWeddingDate)}
          />
          <input
            type="time"
            onChange={(e) => handleWeddingDateTime(e, setWeddingDate)}
            id="timeInput"
          />
          <br />
          <input
            readOnly
            type="text"
            value={weddingDate}
            onKeyDown={handleKeyPress}
          />
        </WeddingDate>
        <AccountWrapper>
          <h4>계좌 (선택)</h4>
          <button type="button" onClick={(e) => addOptionField("account", e)}>
            {" "}
            계좌 추가
          </button>
          <ul>
            {orderData.account.map((v, index) => {
              return (
                <li key={index}>
                  <input
                    type="text"
                    placeholder="계좌명의"
                    onChange={(e) =>
                      handleOnchange("account", "name", index, e)
                    }
                    onKeyDown={handleKeyPress}
                  />
                  <input
                    type="text"
                    placeholder="은행명"
                    onChange={(e) =>
                      handleOnchange("account", "bankName", index, e)
                    }
                    onKeyDown={handleKeyPress}
                  />
                  <input
                    type="text"
                    placeholder="계좌번호"
                    onChange={(e) =>
                      handleOnchange("account", "accountNumber", index, e)
                    }
                    onKeyDown={handleKeyPress}
                  />
                </li>
              );
            })}
          </ul>
        </AccountWrapper>
        <AccountWrapper>
          <h4>혼주 (선택)</h4>
          <button type="button" onClick={(e) => addOptionField("parent", e)}>
            혼주
          </button>
          {orderData.parent.map((items, index) => {
            const badgeBgColors = {
              default: "#6c757d",
              "신랑측 부": "#0dcaf0",
              "신랑측 모": "#EFB6C8",
              "신부측 부": "#5CB338",
              "신부측 모": "#FFC107",
            };

            const badgeBgColor =
              badgeBgColors[items.badge as Badge] || badgeBgColors.default;

            const badgeColor =
              orderData.parent[index].badge === "" ? "#e3e5e6" : "#02181c";
            return (
              <ParentsItems key={index}>
                <BadgeDropdown
                  $badgeBgColor={badgeBgColor}
                  $badgeColor={badgeColor}
                >
                  <div>
                    {orderData.parent[index].badge
                      ? orderData.parent[index].badge
                      : "태그"}
                  </div>
                  <ul>
                    {badge
                      .filter((item) => {
                        return !orderData.parent.some(
                          (parentItem) => parentItem.badge === item
                        );
                      })
                      .map((item, i) => {
                        const badgeBgColors = {
                          default: "#6c757d",
                          "신랑측 부": "#0dcaf0",
                          "신랑측 모": "#EFB6C8",
                          "신부측 부": "#5CB338",
                          "신부측 모": "#FFC107",
                        };
                        console.log(item);
                        const badgeBgColor =
                          badgeBgColors[item as Badge] || badgeBgColors.default;
                        return (
                          <li
                            style={{ backgroundColor: badgeBgColor }}
                            data-value={item}
                            key={i}
                            onClick={(e) =>
                              handleOnclick("parent", "badge", index, e)
                            }
                          >
                            {item}
                          </li>
                        );
                      })}
                  </ul>
                </BadgeDropdown>
                <InputTextWrapper>
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      handleOnchange("parent", "isDeceased", index, e)
                    }
                  />
                  <input
                    type="text"
                    placeholder="성함"
                    onChange={(e) => handleOnchange("parent", "name", index, e)}
                    onKeyDown={handleKeyPress}
                  />
                </InputTextWrapper>
              </ParentsItems>
            );
          })}
        </AccountWrapper>
        <ThumnailWrapper>
          <h4>썸네일</h4>
          <button onClick={(e) => handleThumnailReset("thumnail", e)}>
            썸네일 이미지 초기화
          </button>
          <br />
          <input type="file" onChange={(e) => handleImgUrl("thumnail", e)} />
          {orderData.thumnail.map((v: string, i: number) => {
            return <div key={i}>{v}</div>;
          })}
        </ThumnailWrapper>
        <GalleryWrapper>
          <h4>갤러리</h4>
          {/* 갤러리 하단에서 타입을 선택 => 타입을 선택하면 지정된 개수를 선택할수 있는 input type file 이 생성 */}
          <GalleryTypeDropdown>
            <div>타입선택</div>
            <ul>
              {galleryType.map((type: string, i: number) => {
                return (
                  <li
                    key={i}
                    data-value={type}
                    className="gallery"
                    onClick={(e) => handleSelectedType(e)}
                  >
                    {type} {createMaxLengthUrls(type)}
                  </li>
                );
              })}
            </ul>
          </GalleryTypeDropdown>
          <div style={{ display: "flex" }}>
            <div style={{ marginRight: "1rem" }}>갤러리 선택</div>
            <button
              onClick={(e) =>
                handleGalleryDelete(orderData["gallery"], checkBox, e)
              }
            >
              DELETE
            </button>
          </div>
          <TypeOptionsContainer>
            {Object.keys(orderData["gallery"]).map(
              (galleryId: string, i: number) => {
                const { type } = orderData["gallery"][galleryId];
                return (
                  <TypeOptionsList key={i}>
                    <label>
                      <input
                        id={galleryId}
                        type="checkbox"
                        checked={checkBox.includes(galleryId)}
                        onChange={(e) => handleCheckbox(e)}
                      />
                    </label>
                    <div>
                      <div>
                        {type} 타입 {createMaxLengthUrls(type)}장
                      </div>
                      <input
                        type="file"
                        onChange={(e) =>
                          handleGalleryImageUpload("gallery", galleryId, e)
                        }
                      />
                    </div>
                  </TypeOptionsList>
                );
              }
            )}
          </TypeOptionsContainer>
        </GalleryWrapper>
        <div style={{ display: "flex" }}>
          <button type="submit">제출</button>
          <ErrorSpan style={{ marginLeft: "1rem" }}>{error}</ErrorSpan>
        </div>
      </Form>
    </Container>
  );
};

export default Order;
const InputTextWrapper = styled.div`
  display: flex;
  background-color: white;
  & > input[type="checkbox"] {
    position: relative;
    width: 3rem;

    &::before {
      content: "故";
      position: absolute;
    }
  }
`;

const ParentsItems = styled.div`
  display: flex;
  flex-direction: column;
`;
const BadgeDropdown = styled.div<{
  $badgeBgColor: string;
  $badgeColor: string;
}>`
  display: flex;
  & > div:first-child {
    display: flex;
    justify-content: center;
    background-color: ${(props) => props.$badgeBgColor};
    border-radius: 0.5rem;
    width: 3.5rem;
    font-size: 0.725rem;
    font-weight: bold;
    padding: 0.25rem;
    color: ${(props) => props.$badgeColor};
    box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px,
      rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
  }
  & > ul {
    list-style: none;
    display: none;
  }
  &:hover {
    ul {
      display: flex;

      & > li {
        margin: 0 0.25rem;
        display: flex;
        justify-content: center;
        background-color: #0dcaf0;
        border-radius: 0.5rem;
        width: 3.5rem;
        font-size: 0.725rem;
        font-weight: bold;
        padding: 0.25rem;
        color: #02181c;
        box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px,
          rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
      }
    }
  }
`;

const AccountWrapper = styled.div`
  margin: 1rem 0;
  & > ul {
    list-style: none;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px,
      rgba(0, 0, 0, 0.3) 0px 30px 60px -30px,
      rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset;
    display: flex;
    flex-wrap: wrap;
  }
`;

const GalleryTypeDropdown = styled.div`
  width: 25%;
  position: relative;
  &:hover {
    cursor: pointer;
    & > ul {
      position: absolute;
      background-color: gray;
      display: block;
      list-style: none;
      width: 100%;
      & > li:hover {
        background-color: pink;
      }
    }
  }

  & > ul {
    display: none;
  }
`;

const TypeOptionsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  width: fit-content;
`;

const TypeOptionsList = styled.div`
  display: flex;
  align-items: center;
  & > label {
    padding: 0 0.5rem;
  }
`;

const ErrorSpan = styled.div`
  color: red;
  font-size: 0.75rem;
`;

const Form = styled.form`
  width: 80%;
  min-width: 28rem;
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const WeddingDate = styled.div``;

const AddressWrapper = styled.div`
  display: flex;
  flex-direction: column;
  & > div > div {
    display: flex;

    & > label {
      min-width: 5rem;
    }
  }
  & input[type="text"] {
    outline: none;
    height: 1.5rem;
    width: 13rem;
  }
`;

const NameWrapper = styled.div`
  display: flex;
  flex-direction: column;
  & > div > input[type="text"] {
    outline: none;
    height: 1.5rem;
  }
`;

const ThumnailWrapper = styled.div``;

const GalleryWrapper = styled.div``;
