import {clsx} from "clsx";
import * as React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" };
export default function Button({className, variant = "primary", ...rest}: Props) {
    return (
        <button
            {...rest}
            className={clsx(
                "rounded-xl px-4 py-2 font-semibold disabled:opacity-50",
                variant === "primary"
                    ? "bg-sky-500 hover:bg-sky-600"
                    : "border border-[rgb(var(--border))] hover:bg-white/5",
                className
            )}
        />
    );
}
