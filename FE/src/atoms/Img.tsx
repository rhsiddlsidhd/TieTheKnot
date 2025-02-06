import StyleAtoms from "../styles/atoms";
import { ImgProps } from "../types";

const Img = ({ src, alt, width, height, rounded }: ImgProps) => {
  return (
    <StyleAtoms.ImgWrapper $width={width} $height={height} $rounded={rounded}>
      <img src={src} alt={alt} />
    </StyleAtoms.ImgWrapper>
  );
};

export default Img;
