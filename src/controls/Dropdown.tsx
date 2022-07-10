import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Align } from "@radix-ui/popper";
import styled from 'styled-components';

const Content = styled(DropdownMenu.Content)`
  background-color: var(--background-color-light);
  border-radius: 4px;
  box-shadow: var(--shadow-dropdown);
  padding: 8px;
`;

export const Info = styled(DropdownMenu.Label)`
  font-size: 12px;
  padding: 4px 8px;
`;

export const Item = styled(DropdownMenu.Item)`
  background-color: transparent;
  border-radius: 4px;
  color: var(--color-text);
  cursor: pointer;
  min-width: 172px;
  outline: none;
  padding: 4px 8px;
  transition: background-color 0.15s, color 0.15s;

  &:hover,
  &:focus {
    background-color: var(--primary-color);
    color: white;
  }
`;

export const Separator = styled(DropdownMenu.Separator)`
  background-color: var(--separator-color);
  height: 1px;
  margin: 8px -8px;
  width: calc(100% + 16px);
`;

export const Trigger = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  display: grid;
  margin: 0;
  padding: 0;
  place-content: center;
`;

interface Props {
  align?: Align;
  children: React.ReactNode;
  trigger: React.ReactNode;
}

export function Dropdown(props: Props) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>{props.trigger}</DropdownMenu.Trigger>
      <Content sideOffset={8} align={props.align}>{props.children}</Content>
    </DropdownMenu.Root>
  );
}
