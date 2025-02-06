import StyleAtoms from "../styles/atoms";

interface SectionHeaderProps {
  title: string;
  subTitle: string;
}

const SectionHeader = ({ title, subTitle }: SectionHeaderProps) => {
  return (
    <StyleAtoms.Header>
      <p>{title}</p>
      <h3>{subTitle}</h3>
    </StyleAtoms.Header>
  );
};

export default SectionHeader;
