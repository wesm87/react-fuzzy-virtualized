import type { ReactNode } from 'react';
import Fuse from 'fuse.js';

export type Obj = { [key: string]: any };

export type RenderResultsProps = {
  results: Obj[];
  selectedValue: Obj | null;
  activeResultIndex: number;
  onClick: (value: Obj) => void;
};

export type OptionalProps = {
  id?: string;
  className?: string;
  width?: number | string;
  placeholder?: string;
  autoFocus?: boolean;
  fuseOptions?: Fuse.IFuseOptions<any>;
  filterResults?: (results: Obj[]) => Obj[];
  renderResults?: (props: RenderResultsProps) => ReactNode | ReactNode[];
};

export type RequiredProps = {
  list: Obj[];
  onSelect: (value: Obj) => void;
};

export type Props = OptionalProps & RequiredProps;
