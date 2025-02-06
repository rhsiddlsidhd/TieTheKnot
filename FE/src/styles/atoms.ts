import styled from "styled-components";

const Header = styled.section`
  color: pink;
  margin-bottom: 3rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ImgWrapper = styled.div<{
  $width?: string;
  $height?: string;
  $rounded?: string;
}>`
  padding-bottom: 2rem;
  width: ${(props) => props.$width};
  height: ${(props) => props.$height};

  & > img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
    border-radius: ${(props) => props.$rounded || "0"};
  }
  & > .profile {
    border-radius: 1rem;
  }
`;

interface StyleAtomsType {
  Header: typeof Header;
  ImgWrapper: typeof ImgWrapper;
}

const StyleAtoms: StyleAtomsType = {
  Header,
  ImgWrapper,
};

export default StyleAtoms;
