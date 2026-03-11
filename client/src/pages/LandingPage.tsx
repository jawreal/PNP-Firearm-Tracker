import { LoginForm } from "@/components/login-form";
import PageLogo from "@/components/custom/PageLogo";
import { Separator } from "@/components/ui/separator";

interface IDescription {
  title: string;
  description: string;
}

const DESCRIPTION: IDescription[] = [
  {
    title: "DEPARTMENT",
    description: "Logistics",
  },
  {
    title: "PROVINCE",
    description: "Bulacan",
  },
  {
    title: "REGION",
    description: "III",
  },
];

export default function LandingPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <PageLogo />
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-[22rem]">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src="/police_img.jpg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-start justify-center">
          <div className="px-14 flex flex-col gap-y-5">
            <div className="text-4xl text-gray-200 font-extrabold flex flex-col capitalize">
              <span>san jose del monte</span>
              <span className="text-gray-400">city police station</span>
            </div>
            <span className="text-gray-300/80 w-[27rem]">
              Centralized logistics management for equipment, supplies, and
              resources — keeping our officers ready to serve and protect.
            </span>
            <Separator className="my-3 bg-gray-500" />
            <div className="grid grid-cols-3 w-[27rem]">
              {DESCRIPTION.map((item: IDescription, index: number) => (
                <div key={index} className="flex flex-col">
                  <span className="text-gray-400 text-sm">{item.title}</span>
                  <span className="text-2xl font-extrabold text-gray-300">
                    {item.description}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
