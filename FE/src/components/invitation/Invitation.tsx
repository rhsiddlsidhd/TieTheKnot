import React, { useEffect, useState } from "react";
import { Container } from "../../styles/components";
import SectionHeader from "../../atoms/SectionHeader";
import Img from "../../atoms/Img";
import { BtnWrapper } from "../../pages/Main";
import { quotes } from "../../constants/content";
import { invitationMessage } from "./../../constants/content";
import Text from "../../atoms/Text";
import { InvitationContent } from "./../../styles/components";

interface InvitationProps {
  weddingData: any;
}

const Invitation = ({ weddingData }: InvitationProps) => {
  const [parent, setParent] = useState<
    Record<string, { name: string; isDeceased: string }>
  >({});

  const transformParentData = (data: any[]) => {
    return data.reduce((result, item) => {
      result[item.badge] = {
        name: item.name,
        isDeceased: item.isDeceased,
      };
      return result;
    }, {});
  };

  useEffect(() => {
    if (weddingData) {
      setParent(transformParentData(weddingData.parent));
    }
  }, [weddingData]);

  return (
    <Container>
      <SectionHeader title="Invitation" subTitle="소중한 분들을 초대합니다." />
      <InvitationContent>
        {quotes.map(({ quote, author }, i) => {
          return (
            <div key={i}>
              <Text message={quote} />
              <Text message={author} />
            </div>
          );
        })}
        {Object.keys(invitationMessage).map((key) => {
          return (
            <Text
              key={key}
              message={invitationMessage[key as keyof typeof invitationMessage]}
            />
          );
        })}
      </InvitationContent>
      <Img
        src={`http://localhost:8080/upload/${weddingData.thumnail[1]}`}
        width="80%"
        rounded="10px"
      />
      <InvitationContent>
        {parent && (
          <div>
            <span>{parent["신랑측 부"]?.isDeceased && "𐠦"}</span>
            <span>{parent["신랑측 부"]?.name}</span>
            <span>{parent["신랑측 모"]?.isDeceased && "𐠦"}</span>
            <span>{parent["신랑측 모"]?.name}</span>
            <span>의 장남 {weddingData.name.groom}</span>
          </div>
        )}
        {parent && (
          <div>
            <span>{parent["신부측 부"]?.isDeceased && "𐠦"}</span>
            <span>{parent["신부측 부"]?.name}</span>
            <span>{parent["신부측 모"]?.isDeceased && "𐠦"}</span>
            <span>{parent["신부측 모"]?.name}</span>
            <span>의 장녀 {weddingData.name.bride}</span>
          </div>
        )}
      </InvitationContent>
      <BtnWrapper>
        <button>
          🗞️<span>연락하기</span>
        </button>
      </BtnWrapper>
    </Container>
  );
};

export default Invitation;
