import axios from "axios";
import React, { useState } from "react";
import styled from "styled-components";
import useAuthFailRedirect from "../hooks/useAuthFailRedirect";
import { postOrderInvite } from "../apis/api/order/postOrderInvite";
import { postUploadFiles } from "../apis/api/upload/postUploadFiles";
import { generateRandomId } from "../utils/generateRandomId";

const Order = () => {
  useAuthFailRedirect();
  const galleryType = ["A", "B", "C", "D"];
  const [checkBox, setCheckBox] = useState<string[]>([]);
  const [testData, setTestData] = useState<Record<string, any>>({
    weddingAddress: "",
    weddingDate: "",
    isAccount: {
      name: {
        groom: "",
        bride: "",
      },
      bankDetail: {
        bankname: {
          groom: "",
          bride: "",
        },
        bankcode: {
          groom: "",
          bride: "",
        },
        accountNumber: {
          groom: "",
          bride: "",
        },
      },
    },
    parents: {
      names: {
        groom: {
          father: "",
          mother: "",
        },
        bride: {
          father: "",
          mother: "",
        },
      },
      isAlive: {
        groom: {
          father: false,
          mother: false,
        },
        bride: {
          father: false,
          mother: false,
        },
      },
    },
    thumnail: [],
    gallery: {},
  });

  const handleOrder = async (
    data: Record<string, any>,
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    try {
      const _data = await postOrderInvite(data);
      console.log(_data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleOnchange = (
    field: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const fields = field.split(".");
    const { checked, value, type } = e.target;
    setTestData((prev) => {
      let newData = { ...prev };
      let temp = newData;
      fields.forEach((field, index) => {
        if (index === fields.length - 1) {
          if (type === "checkbox") {
            temp[field] = checked;
          } else {
            temp[field] = value;
          }
        } else {
          temp = temp[field];
        }
      });
      return newData;
    });
  };

  // const uploadFile = async (file: File): Promise<string | void> => {
  //   try {
  //     const fileUrl = await postUploadFiles(file);

  //     return fileUrl;
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const getFileUrls = async (files: File[]): Promise<string[]> => {
    try {
      let fileUrls: string[] = [];
      if (!files) {
        throw new Error(`files is ${typeof files}`);
      }

      const _file = [...files];
      for (const file of _file) {
        const fileUrl = await postUploadFiles(file);
        fileUrls.push(fileUrl);
      }

      return fileUrls;
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
      return [];
    }
  };

  const handleImgUrl = async (
    field: string,
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const files = e.target.files;
    if (files) {
      const fileUrls = await getFileUrls(files && Array.from(files));

      setTestData((prev) => {
        const __prev = { ...prev };
        if (__prev[field].length + 1 > 2) {
          alert("이미지는 최대 2장까지 입력이 가능합니다");
          return { ...prev };
        }
        return {
          ...prev,
          [field]: [...prev[field], ...fileUrls],
        };
      });
    }
  };

  const createMaxLengthUrls = (type: string): number => {
    const maxUrls: Record<string, number> = {
      A: 3,
      B: 3,
      C: 4,
      D: 4,
    };
    return maxUrls[type];
  };

  const handleGalleryUrl = async (
    field: string,
    galleryId: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;

    if (files) {
      const fileUrls = await getFileUrls(files && Array.from(files));

      setTestData((prev) => {
        const { type, urls: prevUrls } = prev[field][galleryId];
        const maxLength = createMaxLengthUrls(type);
        const currentLength = 1;

        if (maxLength < prevUrls.length + currentLength) {
          alert(`${type}에 따른 이미지 개수가 초과하였습니다.`);
          return prev;
        }

        return {
          ...prev,
          [field]: {
            ...prev[field],
            [galleryId]: {
              ...prev[galleryId],
              type,
              urls: [...prevUrls, ...fileUrls],
            },
          },
        };
      });
    }
  };

  const handleReset = (field: string) => {
    setTestData((prev) => {
      const updatedField = [...prev[field]];
      updatedField.pop();
      return {
        ...prev,
        [field]: updatedField,
      };
    });
  };

  const handleSelectedType: React.MouseEventHandler<HTMLLIElement> = (e) => {
    const type = e.currentTarget.dataset.set;
    const gallery = e.currentTarget.className;

    if (type && gallery) {
      const _id = generateRandomId();
      setTestData((prev) => {
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

  const handleCheckbox = (e: React.MouseEvent<HTMLInputElement>): void => {
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
    selectedData: string[]
  ): void => {
    let updatedGalleryIds = { ...totalData };

    selectedData.forEach((id: string) => {
      delete updatedGalleryIds[id];
    });

    setTestData((prevData) => ({
      ...prevData,
      gallery: updatedGalleryIds,
    }));
  };

  return (
    <form onSubmit={(e) => handleOrder(testData, e)}>
      <div>주소</div>
      <input
        type="text"
        onChange={(e) => handleOnchange("weddingAddress", e)}
      />
      <div>날짜</div>
      <input type="text" onChange={(e) => handleOnchange("weddingDate", e)} />
      <div>계좌 이름</div>
      <input
        type="text"
        onChange={(e) => handleOnchange("isAccount.name.groom", e)}
        placeholder="신랑"
      />
      <input
        type="text"
        onChange={(e) => handleOnchange("isAccount.name.bride", e)}
        placeholder="신부"
      />
      <div>계좌 정보</div>

      <input
        type="text"
        onChange={(e) =>
          handleOnchange("isAccount.bankDetail.bankname.groom", e)
        }
        placeholder="신랑 은행명"
      />
      <input
        type="text"
        onChange={(e) =>
          handleOnchange("isAccount.bankDetail.bankname.bride", e)
        }
        placeholder="신부 은행명"
      />
      <input
        type="text"
        onChange={(e) =>
          handleOnchange("isAccount.bankDetail.bankcode.groom", e)
        }
        placeholder="신랑 은행 코드"
      />
      <input
        type="text"
        onChange={(e) =>
          handleOnchange("isAccount.bankDetail.bankcode.bride", e)
        }
        placeholder="신부 은행 코드"
      />
      <input
        type="text"
        onChange={(e) =>
          handleOnchange("isAccount.bankDetail.accountNumber.groom", e)
        }
        placeholder="신랑 계좌 번호"
      />
      <input
        type="text"
        onChange={(e) =>
          handleOnchange("isAccount.bankDetail.accountNumber.bride", e)
        }
        placeholder="신부 계좌 번호"
      />
      <div>부모님 성함</div>
      <ParentsWrapper>
        <IsDeceasedWrapper>
          <div>故</div>
          <input
            onChange={(e) => handleOnchange("parents.isAlive.groom.father", e)}
            type="checkbox"
          />
        </IsDeceasedWrapper>
        <input
          type="text"
          onChange={(e) => handleOnchange("parents.names.groom.father", e)}
          placeholder="신랑측 아버지"
        />
        <IsDeceasedWrapper>
          <div>故</div>
          <input
            type="checkbox"
            onChange={(e) => handleOnchange("parents.isAlive.groom.mother", e)}
          />
        </IsDeceasedWrapper>
        <input
          type="text"
          onChange={(e) => handleOnchange("parents.names.groom.mother", e)}
          placeholder="신랑측 어머니"
        />
      </ParentsWrapper>
      <ParentsWrapper>
        <IsDeceasedWrapper>
          <div>故</div>
          <input
            type="checkbox"
            onChange={(e) => handleOnchange("parents.isAlive.bride.father", e)}
          />
        </IsDeceasedWrapper>
        <input
          type="text"
          onChange={(e) => handleOnchange("parents.names.bride.father", e)}
          placeholder="신부측 아버지"
        />
        <IsDeceasedWrapper>
          <div>故</div>
          <input
            type="checkbox"
            onChange={(e) => handleOnchange("parents.isAlive.bride.mother", e)}
          />
        </IsDeceasedWrapper>
        <input
          type="text"
          onChange={(e) => handleOnchange("parents.names.bride.mother", e)}
          placeholder="신부측 어머니"
        />
      </ParentsWrapper>
      <div>썸네일</div>
      <button onClick={() => handleReset("thumnail")}>
        썸네일 이미지 초기화
      </button>
      <br />
      <input type="file" onChange={(e) => handleImgUrl("thumnail", e)} />
      {testData.thumnail.map((v: string, i: number) => {
        return <div key={i}>{v}</div>;
      })}
      <div>갤러리</div>
      <button onClick={() => handleReset("gallery")}>갤러리 초기화</button>
      {/* 갤러리 하단에서 타입을 선택 => 타입을 선택하면 지정된 개수를 선택할수 있는 input type file 이 생성 */}
      <DropDown>
        <div>타입선택</div>
        <ul>
          {galleryType.map((type: string, i: number) => {
            return (
              <li
                key={i}
                data-set={type}
                className="gallery"
                onClick={(e) => handleSelectedType(e)}
              >
                {type}
              </li>
            );
          })}
        </ul>
      </DropDown>
      <div style={{ display: "flex" }}>
        <div style={{ marginRight: "1rem" }}>갤러리 선택</div>
        <button
          onClick={() => handleGalleryDelete(testData["gallery"], checkBox)}
        >
          DELETE
        </button>
      </div>
      <GalleryContainer>
        {Object.keys(testData["gallery"]).map(
          (galleryId: string, i: number) => {
            const { type, urls } = testData["gallery"][galleryId];
            return (
              <GalleryWrapper key={i}>
                <label>
                  <input
                    id={galleryId}
                    type="checkbox"
                    onClick={(e) => handleCheckbox(e)}
                  />
                </label>
                <div>
                  <div>{type} 타입</div>
                  <input
                    type="file"
                    onChange={(e) => handleGalleryUrl("gallery", galleryId, e)}
                  />
                </div>
              </GalleryWrapper>
            );
          }
        )}
      </GalleryContainer>
      <button type="submit">제출</button>
    </form>
  );
};

export default Order;

const DropDown = styled.div`
  background-color: green;
  &:hover {
    cursor: pointer;
    & > ul {
      display: block;
      & > li:hover {
        background-color: pink;
      }
    }
  }

  & > ul {
    display: none;
  }
`;

const GalleryContainer = styled.div`
  width: 100%;
  background-color: #f1b3bd;
  display: flex;
  flex-direction: column;
  width: fit-content;
  & > div {
  }
`;

const GalleryWrapper = styled.div`
  display: flex;
  align-items: center;
  & > label {
    padding: 1rem;
  }
`;

const IsDeceasedWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const ParentsWrapper = styled.div`
  display: flex;
`;
