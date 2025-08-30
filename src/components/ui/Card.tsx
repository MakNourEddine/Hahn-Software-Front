import {clsx} from "clsx";
import * as React from "react";

export default function Card({className, ...rest}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            {...rest}
            className={clsx("rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--panel))] p-4", className)}
        />
    );
}
