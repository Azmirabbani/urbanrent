import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils.js";

export const PasswordInput = forwardRef(function PasswordInput(
  { className, ...props },
  ref,
) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <input
        ref={ref}
        type={show ? "text" : "password"}
        className={cn(
          "flex h-10 w-full rounded-md border border-stone-300 bg-white px-3 py-2 pr-10 text-base text-stone-900 placeholder:text-stone-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      />
      <button
        type="button"
        tabIndex={-1}
        onClick={() => setShow((s) => !s)}
        className="absolute inset-y-0 right-0 flex items-center px-3 text-stone-400 transition hover:text-stone-700"
        aria-label={show ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
});
