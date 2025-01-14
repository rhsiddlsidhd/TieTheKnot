import React, { useEffect, useRef } from "react";
import { SectionHeader, WeddingInvitationContainer } from "../../pages/Main";
import styled from "styled-components";

const GuestBook = () => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const value = "ddddddddddddddddddddddddd.";
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);
  return (
    <WeddingInvitationContainer>
      <SectionHeader>
        <p>GusetBook</p>
        <h3>방명록 </h3>
      </SectionHeader>
      <PostsWrapper>
        <section>
          <div>
            <input readOnly type="text" placeholder="조자룡"></input>
            <button type="button">X</button>
          </div>
          <textarea
            ref={textareaRef}
            readOnly
            value="zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz"
          />
        </section>
        <section>
          <div>
            <input readOnly type="text" placeholder="조자룡"></input>
            <button type="button">X</button>
          </div>
          <textarea ref={textareaRef} readOnly value="zzzzzz" />
        </section>
        <section>
          <div>
            <input readOnly type="text" placeholder="조자룡"></input>
            <button type="button">X</button>
          </div>
          <textarea
            ref={textareaRef}
            readOnly
            value="zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz"
          />
        </section>
        <section>
          <div>
            <input readOnly type="text" placeholder="조자룡"></input>
            <button type="button">X</button>
          </div>
          <textarea ref={textareaRef} readOnly value="z" />
        </section>
      </PostsWrapper>
    </WeddingInvitationContainer>
  );
};

export default GuestBook;

const PostsWrapper = styled.div`
  width: 100%;
  margin-bottom: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  & > section {
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
    border-radius: 1rem;
    width: 80%;
    min-height: 5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    padding: 1rem;
    margin-bottom: 1.25rem;
    & > div {
      width: 90%;
      height: 2rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      & > input[type="text"] {
        width: 80%;
        height: fit-content;
        background-color: transparent;
        border: none;
        outline: none;
        color: black;
        font-weight: bold;
      }
      & > button {
        border: none;
        background-color: transparent;
        color: #b1a8a8e2;
        cursor: pointer;
        &:hover {
          color: black;
        }
      }
    }
    & > textarea {
      width: 90%;
      border: none;
      background-color: transparent;
      resize: none;
      outline: none;
      overflow: hidden;
      line-height: 1.5;
      min-height: 3rem;
    }
  }
`;
