import React, { useEffect, useRef, useState } from "react";
import { SectionHeader, WeddingInvitationContainer } from "../../pages/Main";
import styled from "styled-components";
import { Account } from "../../pages/Order";

interface AccountSectionProps {
  account: Account[]; // Account[] 배열 형태로 정의
}

const AccountSection = ({ account }: AccountSectionProps) => {
  const dropItemRef = useRef<HTMLLIElement>(null);
  const [listHeight, setListHeight] = useState<number>(0);
  const [isDrop, setIsDrop] = useState<Record<string, boolean>>({});
  const handleDropdown = (
    e: React.MouseEvent<HTMLDivElement>,
    name: Account["name"]
  ) => {
    setIsDrop((prev) => {
      return { ...prev, [name]: !prev[name] };
    });
  };

  useEffect(() => {
    if (account) {
      account.forEach((item) => {
        setIsDrop((prev) => {
          return { ...prev, [item.name]: false };
        });
      });
    }
  }, [account]);

  useEffect(() => {
    if (dropItemRef && dropItemRef.current) {
      setListHeight(dropItemRef.current.offsetHeight * 2);
    }
  }, []);

  const noticeMessage = [
    "참석이 어려우신 분들을 위해",
    "계좌번호를 기재하였습니다.",
    "너그러운 마음으로 양해 부탁드립니다.",
  ];

  const handleClipBoard = async (
    bankName: Account["bankName"],
    accountNumber: Account["accountNumber"]
  ): Promise<void> => {
    try {
      const text = `${bankName} ${accountNumber}`;
      await navigator.clipboard.writeText(text);

      alert(text);
    } catch (error) {
      if (error instanceof Error) {
        alert(
          `클립보드 복사로부터 알 수 없는 오류가 발생하였습니다. MESSAGE :${error.message}`
        );
      }
    }
  };
  return (
    <WeddingInvitationContainer>
      <SectionHeader>
        <p>A c c o u n t</p>
        <h3>마 음 전 하 실 곳</h3>
      </SectionHeader>
      <AccountWrapper>
        {noticeMessage.map((message, i) => {
          return <NoticeMessage key={i}>{message}</NoticeMessage>;
        })}
        <AccountInfo>
          {account.map((item, i) => {
            const { accountNumber, bankName, name } = item;

            return (
              <AccountDropdown
                key={i}
                $isDrop={isDrop[name]}
                $listHeight={listHeight}
              >
                <div className="title" onClick={(e) => handleDropdown(e, name)}>
                  신랑측 계좌번호
                </div>
                <ul className="info_lists">
                  <li className="list" ref={dropItemRef}>
                    <section className="info">
                      <div>
                        <span
                          onClick={() =>
                            handleClipBoard(bankName, accountNumber)
                          }
                          className="clip"
                        >
                          📰
                        </span>
                        <span>{name}</span>
                      </div>
                      <div>
                        <span>{bankName}</span>
                        <span>{accountNumber}</span>
                      </div>
                    </section>
                    <section className="kakao">
                      <img
                        alt="카카오페이"
                        src={`${process.env.REACT_APP_IMAGE_BASE_URL}/kakaopay_icon.png`}
                      />
                    </section>
                  </li>
                </ul>
              </AccountDropdown>
            );
          })}
        </AccountInfo>
      </AccountWrapper>
    </WeddingInvitationContainer>
  );
};

export default AccountSection;

const AccountWrapper = styled.div`
  width: 80%;
`;

const NoticeMessage = styled.div``;

const AccountInfo = styled.div`
  margin-top: 2.5rem;
`;

const AccountDropdown = styled.div<{
  $isDrop: boolean;
  $listHeight: number;
}>`
  width: 100%;
  background-color: #f3f3f3;
  .title {
    padding: 1rem;
    z-index: 5;
    cursor: pointer;
    margin-bottom: 1rem;
    background-color: #f3f3f3;
  }

  .title::after {
    content: "⏷";
    transform: ${(props) =>
      props.$isDrop ? "rotate(-180deg)" : "rotate(0deg)"};
    display: inline-block;
    transition: transform 0.2s ease-in;
    z-index: 100;
    font-weight: bold;
  }
  .info_lists {
    list-style: none;
    max-height: ${(props) => (props.$isDrop ? `${props.$listHeight}px` : 0)};
    visibility: ${(props) => (props.$isDrop ? "visible" : "hidden")};
    transition: max-height 0.2s, visibility 0.1s;
    background-color: white;
    .list {
      display: flex;
      justify-content: center;
      & > .info {
        flex-basis: 80%;
        & > div {
          display: flex;
          .clip {
            cursor: pointer;
          }
        }
      }
      & > .kakao {
        cursor: pointer;
        align-items: center;
        display: flex;
        & > img {
          width: 50px;
        }
      }
    }
  }
`;

/**
 *     
    
 */
