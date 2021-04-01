import "react";

declare module 'react' {
  export interface HTMLAttributes<T> {
    activeClassName?: string|null;
  }
}