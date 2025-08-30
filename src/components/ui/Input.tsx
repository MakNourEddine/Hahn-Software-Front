import {forwardRef} from "react";
import {clsx} from "clsx";
import * as React from "react";

type Props = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, Props>(function Input({className, ...rest}, ref) {
    return (
        <input
            ref={ref}
            {...rest}
            className={clsx(
                "rounded-xl border border-[rgb(var(--border))] bg-[#0f1216] px-3 py-2 outline-none focus:ring-2 focus:ring-sky-500",
                className
            )}
        />
    );
});
