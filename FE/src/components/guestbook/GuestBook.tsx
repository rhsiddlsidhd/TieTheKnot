import React, { useCallback, useEffect, useRef, useState } from "react";
import { SectionHeader, WeddingInvitationContainer } from "../../pages/Main";
import styled from "styled-components";
import axios from "axios";
import { useInView } from "react-intersection-observer";
import { getGuestbook } from "../../apis/api/guestbook/getGuestbook";
import { deleteGuestBook } from "../../apis/api/guestbook/deleteGuestbook";

interface GuestBookProps {
  _id: string;
}

interface GuestbookFormData {
  nickname: string;
  orderId: string;
  password: string;
  content: string;
}

type Guestbook = Omit<GuestbookFormData, "orderId" | "password">;
export type DeleteFormData = Omit<GuestbookFormData, "content">;

const GuestBook: React.FC<GuestBookProps> = ({ _id }) => {
  const { ref, inView } = useInView({ threshold: 1 });

  /**
   * 방명록 API
   * C R U D
   * domain book
   */

  /**
   * 개선 방향
   * 1.방명록에 글이 넘칠때 area의 높이 또한 같이 늘어나기 (미완)
   * 2.post delete 최신화 (완)
   * 3.데이터 error 처리 (미완)
   * 4.api 미들웨어 처리 (미완)
   */

  const pageRef = useRef<number>(1);
  const [guestbookId, setGuestbookId] = useState("");
  const [guestbookState, setGuestbookState] = useState<Record<string, boolean>>(
    {}
  );
  const [isPost, setIsPost] = useState<boolean>(false);
  const [guestbook, setGuestbook] = useState<Guestbook[]>([]);
  const [deleteFormData, setDeleteFormData] = useState<DeleteFormData>({
    nickname: "",
    orderId: "",
    password: "",
  });
  const [guestbookFormData, setGuestbookFormData] = useState<GuestbookFormData>(
    {
      nickname: "",
      orderId: "",
      password: "",
      content: "",
    }
  );

  const [more, setMore] = useState<boolean>(true);

  useEffect(() => {
    const fetchGuestbook = async (id: string, page: number) => {
      const { data, hasMore } = await getGuestbook(id, page);

      setMore(hasMore);
      setGuestbook((prev) => {
        if (prev.length === 0) {
          return [...data];
        } else {
          return [...prev, ...data];
        }
      });
      pageRef.current += 1;
    };

    if (inView && more) {
      console.log("~");
      fetchGuestbook(guestbookId, pageRef.current);
    }
  }, [inView, more, guestbookId]);

  useEffect(() => {
    if (guestbook) {
      guestbook.forEach((item) => {
        setGuestbookState((prev) => ({ ...prev, [item.nickname]: false }));
      });
    }
  }, [guestbook]);

  useEffect(() => {
    if (_id) {
      setGuestbookId(_id);
    }
  }, [_id]);

  useEffect(() => {
    if (guestbookId) {
      setGuestbookFormData((prev) => ({ ...prev, orderId: guestbookId }));
      setDeleteFormData((prev) => ({ ...prev, orderId: guestbookId }));
    }
  }, [guestbookId]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleTogglePost: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    setIsPost(!isPost);
  };

  const handleToggleDelete = (
    nickname: string,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    setGuestbookState((prev) => ({ ...prev, [nickname]: !prev[nickname] }));
  };

  const postGuestbook = async (formData: GuestbookFormData) => {
    try {
      const res = await axios.post(`http://localhost:8080/book`, formData);

      const data = res.data;

      const dataArray = Array.isArray(data) ? data : [data];

      setGuestbook((prev) => [...dataArray, ...prev]);
    } catch (error) {
      throw error;
    }
  };

  const resetGuestbookForm = () => {
    setGuestbookFormData((prev) => ({
      ...prev,
      nickname: "",
      password: "",
      content: "",
    }));
    setIsPost(!isPost);
  };

  const handleGuestbookSubmit = async (
    data: GuestbookFormData,
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    const { content, nickname, password } = data;
    if (!content || !nickname || !password) return;

    try {
      await postGuestbook(data);

      alert("게시글이 작성되었습니다.");
      resetGuestbookForm();
    } catch (error) {
      console.error(error);
    }
  };

  const handleFormDataInput: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (e) => {
    e.preventDefault();
    const { value, type } = e.target;

    const fieldMap = {
      text: "nickname",
      password: "password",
      textarea: "content",
    };

    const field = fieldMap[type as keyof typeof fieldMap];

    setGuestbookFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDeleteFormData: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    e.preventDefault();
    const { type, value } = e.target;
    const fieldMap = {
      text: "nickname",
      password: "password",
    };
    const field = fieldMap[type as keyof typeof fieldMap];
    setDeleteFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDeleteGuestBook = async (
    deleteFormData: DeleteFormData,
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    try {
      const data = await deleteGuestBook(deleteFormData);

      const { nickname } = data;

      const filterdData = guestbook.filter(
        (item) => item.nickname !== nickname
      );
      setGuestbook(filterdData);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <WeddingInvitationContainer>
      <SectionHeader>
        <p>GusetBook</p>
        <h3>방명록 </h3>
      </SectionHeader>
      <PostsWrapper>
        {guestbook.map((item, i) => {
          const { nickname, content } = item;
          return (
            <Section key={nickname} $inView={inView} $more={more}>
              {guestbookState[nickname] ? (
                <DeleteForm
                  onSubmit={(e) => handleDeleteGuestBook(deleteFormData, e)}
                >
                  <input
                    type="text"
                    onChange={(e) => handleDeleteFormData(e)}
                    placeholder={nickname}
                  />
                  <input
                    type="password"
                    onChange={(e) => handleDeleteFormData(e)}
                    placeholder="패스워드"
                  />
                  <button type="submit">삭제</button>
                  <button
                    type="button"
                    onClick={(e) => handleToggleDelete(nickname, e)}
                  >
                    X
                  </button>
                </DeleteForm>
              ) : (
                <DeleteDiv>
                  <input readOnly type="text" placeholder={nickname}></input>
                  <button
                    type="button"
                    onClick={(e) => handleToggleDelete(nickname, e)}
                  >
                    X
                  </button>
                </DeleteDiv>
              )}
              <textarea ref={textareaRef} readOnly value={content} />
            </Section>
          );
        })}
        <hr ref={ref} />
      </PostsWrapper>
      <FormWrapper
        onSubmit={(e) => handleGuestbookSubmit(guestbookFormData, e)}
      >
        <Section>
          {isPost ? (
            <PostDiv>
              <input
                key="password"
                type="password"
                placeholder="패스워드"
                value={guestbookFormData.password}
                onChange={(e) => handleFormDataInput(e)}
              />
              <button type="submit">제출</button>
              <button onClick={(e) => handleTogglePost(e)} type="button">
                X
              </button>
            </PostDiv>
          ) : (
            <PostDiv>
              <input
                id="post-input"
                key="nickname"
                type="text"
                placeholder="닉네임"
                value={guestbookFormData.nickname}
                onChange={(e) => handleFormDataInput(e)}
              />
              <button onClick={(e) => handleTogglePost(e)} type="button">
                제출
              </button>
            </PostDiv>
          )}
          <textarea
            value={guestbookFormData.content}
            placeholder="축하의 말을 전달해주세요."
            onChange={(e) => handleFormDataInput(e)}
          />
        </Section>
      </FormWrapper>
      <div style={{ height: "500px" }}></div>
    </WeddingInvitationContainer>
  );
};

export default GuestBook;

const commonFormStyle = `
      width: 80%;
      display: flex;
      align-items: center;
      height:1.5rem;
      border-bottom:1px solid #EAEAEA;
      justify-content: space-between;
      & > input {
        width: 60%;
        height:100%;
        background-color: transparent;
        border: none;
        outline: none;
        color: black;
        font-weight: bold;
        }  
        & > input#post-input{
        width:60%;
        }
        & > input:not([readonly]){
        width:35%;
        }

        
      & > button {
        border: none;
        background-color: transparent;
        color: #b1a8a8e2;
        cursor: pointer;
        height:100%;  
        &:hover {
          color: black;
        }
      }
`;

const commonSectionStyle = `
    box-shadow: rgba(0, 0, 0, 0.2) 0px 7px 29px 0px;
    border-radius: 1rem;
    width: 80%;
    min-height: 7rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    margin-bottom: 1.25rem;
    margin-top:1.25rem;
    & > textarea {
      width: 80%;
      border: none;
      background-color: transparent;
      resize: none;
      outline: none;
      overflow: hidden;
      line-height: 1.5;
      min-height: 3rem;
    }
    & > textarea:not([readonly]){
    box-shadow: rgba(0, 0, 0, 0.2) 0px 7px 29px 0px;
    border-radius:0.25rem;
    background-color:#EAEAEA;
    }

  
`;

const wrapper = `
  width: 100%;
  margin-bottom: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  
`;

const PostsWrapper = styled.div`
  ${wrapper}
  max-height: 500px;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 0;
  }
`;

const FormWrapper = styled.form`
  ${wrapper}
`;

const Section = styled.section<{ $inView?: boolean; $more?: boolean }>`
  ${commonSectionStyle}
  opacity: ${(props) => (props.$inView && props.$more ? 0 : 1)};
  transform: ${(props) =>
    props.$inView && props.$more ? `translateY(50px)` : `translateY(0px)`};
  transition: all 5s;
`;

const DeleteForm = styled.form`
  ${commonFormStyle}
`;

const DeleteDiv = styled.div`
  ${commonFormStyle}
`;

const PostDiv = styled.div`
  ${commonFormStyle}
`;
