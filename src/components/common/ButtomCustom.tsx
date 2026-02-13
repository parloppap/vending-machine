import { Button } from 'antd';
import type { ButtonProps as AntdButtonProps } from 'antd';

interface ButtonCustomProps extends AntdButtonProps {
  text: string;
}

export const ButtonCustom = ({ text, ...props }: ButtonCustomProps) => {
  return <Button {...props}>{text}</Button>;
};

export default ButtonCustom;
